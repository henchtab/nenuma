import { checkProofRequestSchema } from '@/dtos/ton-connect.dto';
import {
  handleAccountInfo,
  handleCheckProof,
  handleGenerateProofPayload,
} from '@/handlers/ton-connect';
import type { FastifyPluginAsync } from 'fastify';
import z from 'zod';

const routes: FastifyPluginAsync = async (server) => {
  // Public routes
  server.post(
    '/check-proof',
    {
      schema: {
        description: 'Check ton proof',
        summary: 'Check ton proof',
        body: checkProofRequestSchema,
        response: {
          200: z
            .object({
              message: z.string(),
              token: z.string(),
            })
            .describe('OK'),
          400: z
            .object({
              message: z.string(),
              error: z.string().optional().describe('Optional error message'),
            })
            .describe('Bad request'),
        },
      },
    },
    handleCheckProof,
  );

  server.get(
    '/generate-proof-payload',
    {
      schema: {
        description: 'Generate proof payload',
        summary: 'Generate proof payload',
        response: {
          200: z
            .object({
              proofToken: z.string(),
            })
            .describe('OK'),
          400: z
            .object({
              message: z.string(),
              error: z.string(),
            })
            .describe('Bad request'),
        },
      },
    },
    handleGenerateProofPayload,
  );

  // Protected routes
  server.get(
    '/account-info',
    {
      schema: {
        description: 'Get account info using the provided token',
        summary: 'Get account info',
        security: [{ apiKey: [] }],
        response: {
          200: z
            .object({
              address: z.string(),
              balance: z.string(),
            })
            .describe('OK'),
          400: z
            .object({
              message: z.string(),
              error: z.string().optional().describe('Optional error message'),
            })
            .describe('Bad request'),
        },
      },
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
