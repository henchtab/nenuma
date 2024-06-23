import { checkProofRequestSchema } from '@/dtos/ton-connect.dto';
import {
  handleAccountInfo,
  handleCheckProof,
  handleGenerateProofPayload,
} from '@/handlers/ton-connect';
import type { FastifyPluginAsync } from 'fastify';

const routes: FastifyPluginAsync = async (server) => {
  // Public routes
  server.post(
    '/check-proof',
    {
      schema: {
        body: checkProofRequestSchema,
      },
    },
    handleCheckProof,
  );

  server.post('/generate-proof-payload', {}, handleGenerateProofPayload);

  // Protected routes
  server.get(
    '/account-info',
    {
      preHandler: async (request, reply) => {
        try {
          await request.jwtVerify();
        } catch (err) {
          reply.send(err);
        }
      },
    },
    handleAccountInfo,
  );
};

export default routes;
