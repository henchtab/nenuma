import { RedisKey } from '@/constants';
import type {
  DeployedOption,
  TransactionList,
  Option,
  InitiatedOption,
  SettledOption,
  ExpiredOption,
} from '@/dtos/account.dto';
import { Address, Cell, TonClient4, generateMerkleProof } from '@ton/ton';
import { Queue, Worker } from 'bullmq';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import {
  CashOrNothingOption,
  loadCashOrNothingOptionDeploy,
  loadStateInit,
} from 'nenuma-contracts';
import z from 'zod';

const QUEUE_BROKERS = 'brokers';
const QUEUE_OPTIONS = 'options';

const SUBSCRIBER_GRACE_PERIOD = 3600n;

const INDEXER_BASE_URL = 'https://testnet.toncenter.com/api/v3';

const OPCODE_CASH_OR_NOTHING_OPTION_DEPLOY = '0xc74f6284';
const OPCODE_CASH_OR_NOTHING_OPTION_SETTLED_IN_MONEY = '0x1800dc14';
const OPCODE_CASH_OR_NOTHING_OPTION_SETTLED_OUT_MONEY = '0xff379604';
const OPCODE_CASH_OR_NOTHING_OPTION_SETTLED_AT_MONEY = '0x50240b79';

const ERROR_CODE_CONTRACT_UNINIT = 'Exit code: -256';

const jsonReplacer = (_: string, v: any) => {
  if (typeof v === 'bigint') {
    return v.toString();
  }

  if (v instanceof Address) {
    return v.toString();
  }

  return v;
};

const jsonReviver = (k: string, v: any) => {
  const bigintKeys = ['optionId', 'initiation', 'expiration', 'investment'];
  const addressKeys = ['address', 'holder', 'writer'];

  if (bigintKeys.includes(k) && typeof v === 'string') {
    return BigInt(v);
  }

  if (addressKeys.includes(k) && typeof v === 'string') {
    return Address.parse(v);
  }

  return v;
};

const routes: FastifyPluginAsyncZod = async (server) => {
  const log = server.log;

  const brokersQueue = new Queue(QUEUE_BROKERS, {
    connection: server.redis,
  });

  const optionsQueue = new Queue(QUEUE_OPTIONS, {
    connection: server.redis,
  });

  brokersQueue.add(
    QUEUE_BROKERS,
    {
      address: server.config.BTC_BROKER_ADDRESS.toString(),
    },
    { repeatJobKey: 'btc-broker', repeat: { every: 5000 } },
  );

  const brokerWorker = new Worker<{ address: string }>(
    QUEUE_BROKERS,
    async (job) => {
      const startUtime = await server.redis.get(RedisKey.BrokerBTCStartUtime);

      const searchParams = new URLSearchParams();
      searchParams.set('account', job.data.address);
      searchParams.set('limit', '20');
      searchParams.set('offset', '0');

      if (startUtime) {
        log.debug(`Fetching transactions for ${job.data.address} starting from ${startUtime}`);

        searchParams.set('start_utime', startUtime);
      }

      const response = await fetch(`${INDEXER_BASE_URL}/transactions?${searchParams.toString()}`, {
        headers: {
          'X-API-KEY': server.config.RPC_PROVIDER_API_KEY,
        },
      });

      if (!response.ok) {
        log.error(
          `Failed to get transactions for ${job.data.address}. Error: ${response.statusText}`,
        );
        // TODO: Log to Sentry
      }

      const { transactions } = (await response.json()) as TransactionList;

      const deployOptionMessages = transactions.flatMap((tx) =>
        tx.out_msgs
          .filter((msg) => msg?.opcode === OPCODE_CASH_OR_NOTHING_OPTION_DEPLOY)
          .map((msg) => ({
            ...msg,
            utime: tx.now,
          }))
          .sort((a, b) => a.utime - b.utime),
      );

      if (deployOptionMessages[0]) {
        server.redis.set(RedisKey.BrokerBTCStartUtime, deployOptionMessages[0].utime.toString());
      }

      deployOptionMessages.forEach(async (msg) => {
        if (!msg.init_state || !msg.destination || !msg.message_content) {
          return;
        }

        const cellSlice = Cell.fromBase64(msg.init_state.body).asSlice();
        const initDataSlice = loadStateInit(cellSlice).data.beginParse();

        initDataSlice.loadRef(); // System
        initDataSlice.loadBit();

        const brokerAddress = initDataSlice.loadAddress();
        const optionId = initDataSlice.loadIntBig(257);

        const bodySlice = Cell.fromBase64(msg.message_content.body).asSlice();
        const agreement = loadCashOrNothingOptionDeploy(bodySlice).agreement;

        const key = `${agreement.holder.toString()}:${brokerAddress.toString()}:option:${optionId}`;

        const isOptionExists = await server.redis.exists(key);

        // Return early to avoid adding the same option to the queue and replacing the existing one
        if (isOptionExists) {
          return;
        }

        const option: DeployedOption = {
          optionId,
          status: 'deployed',
          address: Address.parse(msg.destination),
          agreement,
        };

        server.redis.set(key, JSON.stringify(option, jsonReplacer));

        optionsQueue.add(
          key,
          {
            redisKey: key,
          },
          {
            repeat: {
              every: 5000,
            },
            removeOnComplete: true,
            repeatJobKey: key,
          },
        );
      });
    },
    {
      connection: server.redis,
    },
  );

  brokerWorker.on('completed', (job) => {
    log.info(`${job?.id} has completed!`);
  });

  brokerWorker.on('failed', (job, err) => {
    log.error(`${job?.id} has failed with ${err.stack}`);
  });

  const publicClient = new TonClient4({
    endpoint: 'https://testnet-v4.tonhubapi.com/',
  });

  const worker = new Worker<{ redisKey: string }>(
    QUEUE_OPTIONS,
    async (job) => {
      const option: Option = JSON.parse(
        (await server.redis.get(job.data.redisKey)) || '{}',
        jsonReviver,
      );

      if (option.status === 'settled' && job.repeatJobKey) {
        optionsQueue.removeRepeatableByKey(job.repeatJobKey);
        log.info(`Removed repeatable job with key ${job.repeatJobKey}`);
      }

      const contract = publicClient.open(CashOrNothingOption.fromAddress(option.address));

      if (option.status === 'deployed') {
        try {
          const strikePrice = await contract.getStrikePrice();

          if (!strikePrice) {
            return;
          }

          const updatedOption: InitiatedOption = {
            ...option,
            status: 'initiated',
            strikePrice: Number(strikePrice),
          };

          await server.redis.set(job.data.redisKey, JSON.stringify(updatedOption, jsonReplacer));
        } catch (error) {
          if (error instanceof Error && error.message.includes(ERROR_CODE_CONTRACT_UNINIT)) {
            const searchParams = new URLSearchParams();
            searchParams.set('account', option.address.toString());
            searchParams.set('limit', '20');
            searchParams.set('offset', '0');

            const response = await fetch(
              `${INDEXER_BASE_URL}/transactions?${searchParams.toString()}`,
              {
                headers: {
                  'X-API-KEY': server.config.RPC_PROVIDER_API_KEY,
                },
              },
            );

            if (!response.ok) {
              log.error(
                `Could not fetch option transactions for ${option.address.toString()}. Error: ${response.statusText}`,
              );

              // TODO: Log to Sentry

              return;
            }

            const { transactions } = (await response.json()) as TransactionList;

            if (!transactions.length) {
              return;
            }

            const settledInMoneyMessage = transactions.find((tx) =>
              tx.out_msgs.some(
                (msg) => msg?.opcode === OPCODE_CASH_OR_NOTHING_OPTION_SETTLED_IN_MONEY,
              ),
            );

            const settledOutMoneyMessage = transactions.find((tx) =>
              tx.out_msgs.some(
                (msg) => msg?.opcode === OPCODE_CASH_OR_NOTHING_OPTION_SETTLED_OUT_MONEY,
              ),
            );

            const settledAtMoneyMessage = transactions.find((tx) =>
              tx.out_msgs.some(
                (msg) => msg?.opcode === OPCODE_CASH_OR_NOTHING_OPTION_SETTLED_AT_MONEY,
              ),
            );

            if (!settledInMoneyMessage && !settledOutMoneyMessage && !settledAtMoneyMessage) {
              return;
            }

            const settledOption: SettledOption = {
              ...option,
              strikePrice: 0,
              status: 'settled',
            };

            await server.redis.set(job.data.redisKey, JSON.stringify(settledOption, jsonReplacer));

            const result = await optionsQueue.removeRepeatableByKey(job.repeatJobKey!);

            if (result) {
              log.info(`Removed repeatable job with key ${job.repeatJobKey}`);
            }
          }
        }
      } else if (option.status === 'initiated') {
        try {
          const expiration = await contract.getExpiration();

          if (
            expiration &&
            expiration + SUBSCRIBER_GRACE_PERIOD < BigInt(Math.ceil(Date.now() / 1000))
          ) {
            log.info(`Option ${option.optionId} has expired`);
            const updatedOption: ExpiredOption = {
              ...option,
              status: 'expired',
            };

            await server.redis.set(job.data.redisKey, JSON.stringify(updatedOption, jsonReplacer));
          }
        } catch (error) {
          // console.log(error);

          const updatedOption: SettledOption = {
            ...option,
            status: 'settled',
          };

          await server.redis.set(job.data.redisKey, JSON.stringify(updatedOption, jsonReplacer));
        }
      }
    },
    {
      connection: server.redis,
      concurrency: 10,
    },
  );

  worker.on('completed', (job) => {
    log.info(`${job.name} has completed!`);
  });

  worker.on('failed', (job, err) => {
    log.error(`${job?.id} has failed with ${err.stack}`);
  });

  server.get(
    '/:trader/:broker/options',
    {
      schema: {
        params: z
          .object({
            trader: z.string().transform((v, ctx) => {
              try {
                return Address.parse(v);
              } catch {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: 'Provided trader address is not valid',
                });
              }
            }),
            broker: z.string().transform((v, ctx) => {
              try {
                return Address.parse(v);
              } catch {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: 'Provided broker address is not valid',
                });
              }
            }),
          })
          .required(),
      },
    },
    async (request, reply) => {
      const { trader, broker } = request.params;

      const keys = await server.redis.keys(`${trader!.toString()}:${broker!.toString()}:option:*`);

      if (!keys.length) {
        return reply.code(404).send({
          statusCode: 404,
          message: 'No options found for the provided trader',
        });
      }

      const options = await server.redis.mget(keys);

      const response = new Response(`[${options.filter((v) => v !== null).join(',')}]`, {
        headers: { 'content-type': 'application/json' },
      });

      return reply.code(200).send(response);
    },
  );
};

export default routes;
