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

  bybit.ws.subscribeV5(Object.values(BybitKlineTopic), 'spot');

  bybit.ws.on('update', async (data: BybitResponseDto) => {
    switch (data.topic) {
      case BybitKlineTopic.BTCUSDT:
        for (const candlestick of data.data) {
          if (candlestick.confirm) {
            redis
              .pipeline()
              .rpush(RedisKey.KlineBTC24H, JSON.stringify(candlestick))
              .ltrim(RedisKey.KlineBTC24H, 0, 1439)
              .exec();

            try {
              const client = new TonClient({
                endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
                apiKey: '9e557d76a302f31496f5fe90a62cb4f90ed4ef97a0e8aa08d310080f30f6263c',
              });

              const stream = client.open(
                DataStream.fromAddress(
                  Address.parse('kQDZnFY0yew3AcB0pk0H0CL5L2kclQXH0VHO_cWyfdOQ0SEp'),
                ),
              );

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

              let keyPair = await mnemonicToPrivateKey([
                'squirrel',
                'focus',
                'excite',
                'kangaroo',
                'quit',
                'post',
                'milk',
                'twelve',
                'sketch',
                'cupboard',
                'sunny',
                'similar',
                'toe',
                'orient',
                'soccer',
                'uncle',
                'forward',
                'fame',
                'bundle',
                'vanish',
                'crisp',
                'slush',
                'coast',
                'hair',
              ]);

              let workchain = 0; // Usually you need a workchain 0
              let wallet = WalletContractV4.create({ workchain, publicKey: keyPair.publicKey });
              let contract = client.open(wallet);

              // Create a transfer
              let seqno: number = await contract.getSeqno();

              const candlestickToPublish = {
                $$type: 'Candlestick' as const,
                open: BigInt(candlestick.open.split('.').join('')),
                high: BigInt(candlestick.high.split('.').join('')),
                low: BigInt(candlestick.low.split('.').join('')),
                close: BigInt(candlestick.close.split('.').join('')),
                start: BigInt(candlestick.start.toString().slice(0, -3)),
                end: BigInt(candlestick.end.toString().slice(0, -3)),
              };

              log.debug(
                'Publishing Candlestick: %s',
                JSON.stringify(
                  candlestickToPublish,
                  (_, v) => (typeof v === 'bigint' ? v.toString() : v),
                  2,
                ),
              );

              await contract.sendTransfer({
                seqno,
                secretKey: keyPair.secretKey,
                messages: [
                  internal({
                    value: '5',
                    to: 'kQDZnFY0yew3AcB0pk0H0CL5L2kclQXH0VHO_cWyfdOQ0SEp',
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
            } catch (error) {}
          } else {
            redis.set(RedisKey.KlineBTC1m, JSON.stringify(candlestick));
          }
        }
        break;
      case BybitKlineTopic.ETHUSDT:
        for (const candlestick of data.data) {
          if (candlestick.confirm) {
            redis
              .pipeline()
              .rpush(RedisKey.KlineETH24H, JSON.stringify(candlestick))
              .ltrim(RedisKey.KlineETH24H, 0, 1439)
              .exec();
          } else {
            redis.set(RedisKey.KlineETH1m, JSON.stringify(candlestick));
          }
        }
        break;
      case BybitKlineTopic.BNBUSDT:
        for (const candlestick of data.data) {
          if (candlestick.confirm) {
            redis
              .pipeline()
              .rpush(RedisKey.KlineBNB24H, JSON.stringify(candlestick))
              .ltrim(RedisKey.KlineBNB24H, 0, 1439)
              .exec();
          } else {
            redis.set(RedisKey.KlineBNB1m, JSON.stringify(candlestick));
          }
        }
        break;
      case BybitKlineTopic.SOLUSDT:
        for (const candlestick of data.data) {
          if (candlestick.confirm) {
            redis
              .pipeline()
              .rpush(RedisKey.KlineSOL24H, JSON.stringify(candlestick))
              .ltrim(RedisKey.KlineSOL24H, 0, 1439)
              .exec();
          } else {
            redis.set(RedisKey.KlineSOL1m, JSON.stringify(candlestick));
          }
        }
        break;
      case BybitKlineTopic.TONUSDT:
        for (const candlestick of data.data) {
          if (candlestick.confirm) {
            redis
              .pipeline()
              .rpush(RedisKey.KlineTON24H, JSON.stringify(candlestick))
              .ltrim(RedisKey.KlineTON24H, 0, 1439)
              .exec();
          } else {
            redis.set(RedisKey.KlineTON1m, JSON.stringify(candlestick));
          }
        }
        break;
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
