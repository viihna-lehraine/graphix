// File: backend/src/start.ts

import Fastify from 'fastify';

const app = Fastify({ logger: true });

const { initializeServer } = await import('./server/initialize.js');
const { env } = await initializeServer(app);

try {
  await app.listen({ port: env.server_port, host: env.server_host });
  console.log(`Server running at ${env.base_url}:${env.server_port}`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
