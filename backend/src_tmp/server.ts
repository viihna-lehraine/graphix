

import type { EnvironmentVariables } from './meta/index.js';
import { data } from './meta/index.js';
import { plugins } from './plugins/index.js';
import { routes } from './routes/index.js';
import Fastify from 'fastify';
import jwt from '@fastify/jwt';

const { core } = await import('./app/index.js');

const env: EnvironmentVariables = core.env.load();

const app = Fastify({ logger: true });

await app.register(plugins.knex);

await app.register(routes.auth, { prefix: '/auth' });
await app.register(routes.projects, { prefix: '/projects' });

await app.register(jwt, {
  secret: env.jwt_secret,
  sign: { expiresIn: data.config.jwtExpiration }
});

try {
  await app.listen({ port: env.server_port, host: env.server_host });
  console.log(`Server running at ${env.base_url}:${env.server_port}`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
