import fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import jwt from '@fastify/jwt';
import redis from '@fastify/redis';
import swagger from '@fastify/swagger';
import websocket from '@fastify/websocket';
import scalar from '@scalar/fastify-api-reference';
import * as Sentry from '@sentry/node';
import {
  serializerCompiler,
  validatorCompiler,
  jsonSchemaTransform,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod';
import * as plugins from './plugins';
import routes from './routes';

// Initialize Fastify server
const server = fastify({
  // http2: true,
  logger: {
    level: process.env.LOG_LEVEL,
  },
}).withTypeProvider<ZodTypeProvider>();

// Root route
server.get('/', async (_, reply) =>
  reply.send({ message: 'You are on the root route. To see the API documentation, visit /docs' }),
);

// Sentry error handler setup
Sentry.setupFastifyErrorHandler(server);

// Set validator and serializer compilers
server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

// Register plugins
await server.register(plugins.config);
await server.register(cors, { origin: '*' });
await server.register(helmet);
await server.register(jwt, { secret: server.config.JWT_SECRET });
await server.register(swagger, {
  openapi: {
    openapi: '3.0.0',
    info: {
      title: 'Nenuma API',
      description: '',
      version: '0.1.0',
    },
    components: {
      securitySchemes: {
        apiKey: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header',
        },
      },
    },
  },
  transform: jsonSchemaTransform,
});
await server.register(scalar, {
  routePrefix: '/docs',
  configuration: {
    metaData: {
      title: 'Nenuma API Reference',
      description: 'OpenAPI documentation for Nenuma API endpoints',
    },
    theme: 'deepSpace',
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

// Register routes with prefix
await server.register(routes, { prefix: '/api' });

// Wait until the server is ready
await server.ready();

export default server;
