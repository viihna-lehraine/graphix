// File: backend/src/server/partials/registry.ts

import type { Core, Data, EnvironmentVariables } from '../../meta/index.js';
import type { FastifyInstance } from 'fastify';
import jwt from '@fastify/jwt';

export async function registerPlugins(app: FastifyInstance): Promise<void> {
  const { plugins } = await import('../../plugins/index.js');

  await app.register(plugins.knex);
}

export async function registerRoutes(
  app: FastifyInstance,
  core: Core,
  env: EnvironmentVariables
): Promise<void> {
  const { routes } = await import('../../routes/index.js');

  await app.register(routes.auth, { prefix: '/auth' });
  routes.projects(app, core, env);
}

export async function registerJwt(
  app: FastifyInstance,
  data: Data,
  env: EnvironmentVariables
): Promise<void> {
  const { config } = data;

  await app.register(jwt, {
    secret: env.jwt_secret,
    sign: { expiresIn: config.jwt_expiration }
  });
}
