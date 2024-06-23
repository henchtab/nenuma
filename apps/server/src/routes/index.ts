import type { FastifyPluginAsync } from 'fastify';
import market from './market';
import ton from './ton-connect';

const routes: FastifyPluginAsync = async (server) => {
  await server.register(market);
  await server.register(ton);
};

export default routes;
