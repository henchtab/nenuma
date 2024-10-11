import type { FastifyPluginAsync } from "fastify";
import market from "./market";
import ton from "./ton-connect";
import account from "./account";

const routes: FastifyPluginAsync = async (server) => {
  await server.register(market);
  await server.register(ton);
  await server.register(account);
};

export default routes;
