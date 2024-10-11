import { Address } from "@ton/ton";
import "dotenv/config";
import type { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import z from "zod";

export enum NodeEnv {
  development = "development",
  test = "test",
  production = "production",
}

const configSchema = z.object({
  NODE_ENV: z.nativeEnum(NodeEnv),
  LOG_LEVEL: z.string(),
  API_HOST: z.string(),
  API_PORT: z.string(),
  REDIS_URI: z.string(),
  REDIS_HOST: z.string(),
  REDIS_PORT: z.coerce.number(),
  REDIS_PASSWORD: z.string(),
  REDIS_USER: z.string(),
  COOKIE_SECRET: z.string(),
  JWT_SECRET: z.string(),
  RPC_PROVIDER_API_KEY: z.string(),
  DATA_STREAM_ADDRESS: z.string(),
  BTC_BROKER_ADDRESS: z.string().transform((v) => Address.parse(v)),
  MNEMONIC: z.string(),
});

export type Config = z.infer<typeof configSchema>;

const configPlugin: FastifyPluginAsync = async (server) => {
  const config = configSchema.safeParse(process.env);

  if (!config.success) {
    throw new Error(".env file validation failed - " + JSON.stringify(config.error, null, 2));
  }
  server.decorate("config", config.data);
};

declare module "fastify" {
  interface FastifyInstance {
    config: Config;
  }
}

export default fp(configPlugin);
