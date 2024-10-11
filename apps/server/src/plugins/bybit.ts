import { DefaultLogger, WebsocketClient } from "bybit-api";
import type { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";

const bybitPlugin: FastifyPluginAsync = async (server) => {
  const logger = {
    ...DefaultLogger,
    silly: (...params: any) => console.log("silly", ...params),
  };

  const wsClient = new WebsocketClient(
    {
      market: "v5",
    },
    // logger,
  );

  server.addHook("onClose", async () => {
    wsClient.closeAll();
  });

  server.decorate("bybit", {
    ws: wsClient,
  });
};

declare module "fastify" {
  interface FastifyInstance {
    bybit: {
      ws: WebsocketClient;
    };
  }
}

export default fp(bybitPlugin);
