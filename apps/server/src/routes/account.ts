import { Address, TonClient, TonClient4 } from '@ton/ton';
import { Queue, Worker } from 'bullmq';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import {
  Broker,
  CashOrNothingOption,
  type CashOrNothingOptionAgreement,
  type CashOrNothingOptionDraftAgreement,
} from 'nenuma-contracts';
import z from 'zod';

interface BaseOption {
  optionId: bigint;
}

interface PendingOption extends BaseOption {
  status: 'pending';
  draft: CashOrNothingOptionDraftAgreement;
}

export interface DeployedOption extends BaseOption {
  status: 'deployed';
  address: Address;
  agreement: CashOrNothingOptionAgreement;
}

export interface InitiatedOption extends Omit<DeployedOption, 'status'> {
  status: 'initiated';
  strikePrice: number;
}

export interface SettledOption extends Omit<InitiatedOption, 'status'> {
  status: 'settled';
}

export interface ExpiredOption extends Omit<DeployedOption, 'status'> {
  status: 'expired';
}

type Option = PendingOption | DeployedOption | InitiatedOption | SettledOption | ExpiredOption;

const pendingOptionSchema = z.object({
  status: z.literal('pending'),
  optionId: z.string(),
  draft: z.object({
    $$type: z.literal('CashOrNothingOptionDraftAgreement'),
    holder: z.string(),
    initiation: z.string(),
    expiration: z.string(),
    investment: z.string(),
    optionType: z.boolean(),
  }),
});

const optionReplacer = (_: string, v: any) => {
  if (typeof v === 'bigint') {
    return v.toString();
  }

  if (v instanceof Address) {
    return v.toString();
  }

  return v;
};

const optionReviver = (k: string, v: any) => {
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

const SUBSCRIBER_GRACE_PERIOD = 3600n;

const routes: FastifyPluginAsyncZod = async (server) => {
  const log = server.log;

  const queue = new Queue('options', {
    connection: {
      host: server.config.REDIS_HOST,
      port: server.config.REDIS_PORT,
      username: server.config.REDIS_USER,
      password: server.config.REDIS_PASSWORD,
    },
  });

  const publicClient = new TonClient4({
    endpoint: 'https://testnet-v4.tonhubapi.com/',
    // apiKey: server.config.RPC_PROVIDER_API_KEY,
  });

  // Spawn workers
  for (let i = 0; i < 5; i++) {
    const worker = new Worker<{ redisKey: string; trader: string }>(
      'options',
      async (job) => {
        const option: Option = JSON.parse(
          (await server.redis.get(job.data.redisKey)) || '',
          optionReviver,
        );

        if (option.status === 'settled' && job.repeatJobKey) {
          const result = await queue.removeRepeatableByKey(job.repeatJobKey);
          log.info(`Removed repeatable job ${job.repeatJobKey} with result ${result}`);
        }

        if (option.status === 'pending') {
          for (let i = 0n; i < 32n; i++) {
            log.debug(`Checking option ${option.optionId + i}...`);

            const optionAddress = await publicClient
              .open(Broker.fromAddress(server.config.BTC_BROKER_ADDRESS))
              .getOptionAddress(option.optionId + i);

            log.debug(
              `Option address: ${optionAddress.toString({ testOnly: true, bounceable: false })}`,
            );

            const contract = publicClient.open(CashOrNothingOption.fromAddress(optionAddress));

            try {
              const agreement = await contract.getAgreement();

              if (agreement && agreement.holder.toString() === job.data.trader) {
                log.debug(`Option ${option.optionId + i} has been deployed!`);
                const updatedOption: DeployedOption = {
                  ...option,
                  status: 'deployed',
                  address: contract.address,
                  agreement,
                };

                server.redis.set(job.data.redisKey, JSON.stringify(updatedOption, optionReplacer));
              }
            } catch (error) {
              if (error instanceof Error && error.message.includes('-256')) {
                log.error(
                  `Option with address ${contract.address.toString({ testOnly: true })} has not been deployed. Full error: ${error}`,
                );
              }

              // console.error(error);
              break;
            }
          }

          return;
        }

        const contract = publicClient.open(CashOrNothingOption.fromAddress(option.address));

        if (option.status === 'deployed') {
          try {
            const strikePrice = await contract.getStrikePrice();

            console.log(`Strike price: ${strikePrice}`);

            if (!strikePrice) {
              return;
            }

            const updatedOption: InitiatedOption = {
              ...option,
              status: 'initiated',
              strikePrice: Number(strikePrice),
            };

            server.redis.set(job.data.redisKey, JSON.stringify(updatedOption, optionReplacer));
          } catch (error) {}
        } else if (option.status === 'initiated') {
          try {
            const expiration = await contract.getExpiration();

            if (
              expiration &&
              expiration + SUBSCRIBER_GRACE_PERIOD < BigInt(Math.ceil(Date.now() / 1000))
            ) {
              console.log('Option has expired!');
              const updatedOption: ExpiredOption = {
                ...option,
                status: 'expired',
              };

              server.redis.set(job.data.redisKey, JSON.stringify(updatedOption, optionReplacer));
            }
          } catch (error) {
            console.log(error);

            const updatedOption: SettledOption = {
              ...option,
              status: 'settled',
            };

            server.redis.set(job.data.redisKey, JSON.stringify(updatedOption, optionReplacer));
          }
        }

        log.info(`Processing option ${option.optionId}`);
      },
      {
        connection: {
          host: server.config.REDIS_HOST,
          port: server.config.REDIS_PORT,
          username: server.config.REDIS_USER,
          password: server.config.REDIS_PASSWORD,
        },
      },
    );

    worker.on('completed', (job) => {
      log.info(`${job.id} has completed!`);
    });

    worker.on('failed', (job, err) => {
      log.error(`${job?.id} has failed with ${err.stack}`);
    });
  }

  // FIXME: Add trading pair to the key and route params
  server.post(
    '/options',
    {
      preHandler: async (request, reply) => {
        try {
          await request.jwtVerify();
        } catch (e) {
          return reply.send(e);
        }
      },
      schema: {
        body: z.object({
          pendingOption: pendingOptionSchema,
          trader: z.string().transform((v, ctx) => {
            try {
              return Address.parse(v);
            } catch {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Provided address is not valid',
              });
            }
          }),
        }),
      },
    },
    async (request, reply) => {
      const body = request.body;

      const key = `${body.trader?.toString()}:option-${body.pendingOption.optionId}`;
      server.redis.set(key, JSON.stringify(body.pendingOption, optionReplacer));

      await queue.add(
        `option-${body.pendingOption.optionId}`,
        {
          redisKey: key,
          trader: body.trader?.toString(),
        },
        {
          removeOnComplete: true,
          repeat: {
            every: 5000,
          },
          repeatJobKey: `option-${body.pendingOption.optionId}`,
        },
      );

      reply.code(202).send({
        statusCode: 202,
        message: 'Option has been added to the tracking queue',
      });
    },
  );

  server.get(
    '/:trader/options',
    {
      schema: {
        params: z.object({
          trader: z.string().transform((v, ctx) => {
            try {
              return Address.parse(v);
            } catch {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Provided address is not valid',
              });
            }
          }),
        }),
      },
    },
    async (request, reply) => {
      const keys = await server.redis.keys(`${request.params.trader?.toString()}:option-*`);

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
