import { BybitKlineTopic, RedisKey } from '@/constants';
import { KlineTopic, type BybitResponseDto } from '@/dtos/market.dto';
import { handleKlineTopic, handleKlineTopicWS } from '@/handlers/market';
import { mnemonicToPrivateKey } from '@ton/crypto';
import { Address, TonClient, WalletContractV4, beginCell, internal } from '@ton/ton';
import type { FastifyPluginAsync } from 'fastify';

import { DataStream, storeDSTPublishCandlestick } from 'nenuma-contracts';

import z from 'zod';

const routes: FastifyPluginAsync = async (server) => {
  const { redis, bybit, log } = server;

  bybit.ws.subscribeV5(BybitKlineTopic.BTCUSDT, 'spot');

  const publicClient = new TonClient({
    endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
    apiKey: server.config.RPC_PROVIDER_API_KEY,
  });

  const keyPair = await mnemonicToPrivateKey(server.config.MNEMONIC.split(','));

  const workchain = 0; // Usually you need a workchain 0
  const wallet = WalletContractV4.create({ workchain, publicKey: keyPair.publicKey });
  const btcCandlestickPublisherWallet = publicClient.open(wallet);

  const stream = publicClient.open(
    DataStream.fromAddress(Address.parse(server.config.DATA_STREAM_ADDRESS)),
  );

  bybit.ws.on('update', async (data: BybitResponseDto) => {
    switch (data.topic) {
      case BybitKlineTopic.BTCUSDT:
        for (const candlestick of data.data) {
          if (candlestick.confirm) {
            redis
              .pipeline()
              .rpush(RedisKey.KlineBTC24H, JSON.stringify(candlestick))
              .ltrim(RedisKey.KlineBTC24H, -1440, -1)
              .exec();

            try {
              const batches = await stream.getBatches();

              let shouldSkip = false;
              // Check if every batch is empty
              for (const [_, info] of batches) {
                log.debug('Batch Info: %s', info.subscriptionsCount.toString());
                if (info.subscriptionsCount > 0) {
                  shouldSkip = false;
                } else {
                  shouldSkip = true;
                }
              }

              if (shouldSkip) {
                return;
              }

              const seqno = await btcCandlestickPublisherWallet.getSeqno();

              const candlestickToPublish = {
                $$type: 'Candlestick' as const,
                open: BigInt(candlestick.open.split('.').join('')),
                high: BigInt(candlestick.high.split('.').join('')),
                low: BigInt(candlestick.low.split('.').join('')),
                close: BigInt(candlestick.close.split('.').join('')),
                start: BigInt(candlestick.start.toString().slice(0, -3)),
                end: BigInt(candlestick.end.toString().slice(0, -3)) + 1n,
              };

              log.debug(
                'Publishing Candlestick: %s',
                JSON.stringify(
                  candlestickToPublish,
                  (_, v) => (typeof v === 'bigint' ? v.toString() : v),
                  2,
                ),
              );

              await btcCandlestickPublisherWallet.sendTransfer({
                seqno,
                secretKey: keyPair.secretKey,
                messages: [
                  internal({
                    value: '5',
                    to: server.config.DATA_STREAM_ADDRESS,
                    body: beginCell()
                      .store(
                        storeDSTPublishCandlestick({
                          $$type: 'DSTPublishCandlestick',
                          queryId: 777n,
                          candlestick: candlestickToPublish,
                        }),
                      )
                      .endCell(),
                  }),
                ],
              });
            } catch (error) {
              log.error('Error: %s', error);
            }
          } else {
            redis.set(RedisKey.KlineBTC1m, JSON.stringify(candlestick));
          }
        }
        break;
      // case BybitKlineTopic.ETHUSDT:
      //   for (const candlestick of data.data) {
      //     if (candlestick.confirm) {
      //       redis
      //         .pipeline()
      //         .rpush(RedisKey.KlineETH24H, JSON.stringify(candlestick))
      //         .ltrim(RedisKey.KlineETH24H, 0, 1439)
      //         .exec();
      //     } else {
      //       redis.set(RedisKey.KlineETH1m, JSON.stringify(candlestick));
      //     }
      //   }
      //   break;
      // case BybitKlineTopic.BNBUSDT:
      //   for (const candlestick of data.data) {
      //     if (candlestick.confirm) {
      //       redis
      //         .pipeline()
      //         .rpush(RedisKey.KlineBNB24H, JSON.stringify(candlestick))
      //         .ltrim(RedisKey.KlineBNB24H, 0, 1439)
      //         .exec();
      //     } else {
      //       redis.set(RedisKey.KlineBNB1m, JSON.stringify(candlestick));
      //     }
      //   }
      //   break;
      // case BybitKlineTopic.SOLUSDT:
      //   for (const candlestick of data.data) {
      //     if (candlestick.confirm) {
      //       redis
      //         .pipeline()
      //         .rpush(RedisKey.KlineSOL24H, JSON.stringify(candlestick))
      //         .ltrim(RedisKey.KlineSOL24H, 0, 1439)
      //         .exec();
      //     } else {
      //       redis.set(RedisKey.KlineSOL1m, JSON.stringify(candlestick));
      //     }
      //   }
      //   break;
      // case BybitKlineTopic.TONUSDT:
      //   for (const candlestick of data.data) {
      //     if (candlestick.confirm) {
      //       redis
      //         .pipeline()
      //         .rpush(RedisKey.KlineTON24H, JSON.stringify(candlestick))
      //         .ltrim(RedisKey.KlineTON24H, 0, 1439)
      //         .exec();
      //     } else {
      //       redis.set(RedisKey.KlineTON1m, JSON.stringify(candlestick));
      //     }
      //   }
      //   break;
    }
  });

  server.get(
    '/kline/:topic',
    {
      schema: {
        params: z.object({
          topic: KlineTopic,
        }),
        querystring: z
          .object({
            token: z.string().optional(),
          })
          .optional(),
      },
      preHandler: async (request, reply) => {
        try {
          await request.jwtVerify();
        } catch (err) {
          reply.send(err);
        }
      },
    },
    handleKlineTopic,
  );

  server.get(
    '/kline',
    {
      websocket: true,
      preHandler: async (request, reply) => {
        try {
          if (request.query && typeof request.query === 'object' && 'token' in request.query) {
            const { token } = request.query as { token: string };
            request.headers.authorization = `Bearer ${token}`;
          }
          await request.jwtVerify();
        } catch (err) {
          reply.send(err);
        }
      },
    },
    handleKlineTopicWS,
  );
};

export default routes;
