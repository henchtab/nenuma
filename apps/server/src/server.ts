import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import jwt from '@fastify/jwt';
import redis from '@fastify/redis';
import swagger from '@fastify/swagger';
import websocket from '@fastify/websocket';
import scalar from '@scalar/fastify-api-reference';
import fastify from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod';
import * as plugins from './plugins';
import routes from './routes';

const server = fastify({
  // http2: true,
  logger: {
    level: process.env.LOG_LEVEL,
  },
}).withTypeProvider<ZodTypeProvider>();

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

await server.register(plugins.config);
await server.register(cors, {
  origin: '*',
});
await server.register(helmet);
await server.register(jwt, {
  secret: server.config.JWT_SECRET,
});
await server.register(swagger, {
  openapi: {
    openapi: '3.0.0',
    info: {
      title: 'Test swagger',
      description: 'Testing the Fastify swagger API',
      version: '0.1.0',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    tags: [
      { name: 'user', description: 'User related end-points' },
      { name: 'code', description: 'Code related end-points' },
    ],
    components: {
      securitySchemes: {
        apiKey: {
          type: 'apiKey',
          name: 'apiKey',
          in: 'header',
        },
      },
    },
    externalDocs: {
      url: 'https://swagger.io',
      description: 'Find more info here',
    },
  },
});
await server.register(scalar, {
  routePrefix: '/reference',
  configuration: {
    spec: {
      content: () => server.swagger(),
    },
  },
});
await server.register(websocket, {
  options: {
    maxPayload: 1048576,
  },
});
await server.register(redis, {
  url: server.config.REDIS_URI,
  maxRetriesPerRequest: null,
});
await server.register(plugins.bybit);

server.get('/', (_, reply) => reply.code(418).send({ message: 'I am a teapot' }));
await server.register(routes);

await server.ready();

export default server;
