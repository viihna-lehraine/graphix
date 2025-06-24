// File: backend/src/server/partials/factories.ts

import type {
  Core,
  Data,
  EnvironmentVariables,
  Services
} from '../../meta/index.js';
import type { FastifyInstance } from 'fastify';

export async function createCore(): Promise<Core> {
  return (await import('../../core/index.js')).core;
}

export async function createData(): Promise<Data> {
  return (await import('../../meta/data/index.js')).data;
}

export function createEnvVars(core: Core): EnvironmentVariables {
  return core.env.load();
}

export async function createServices(
  fastify: FastifyInstance,
  core: Core,
  env: EnvironmentVariables
): Promise<Services> {
  const { AuthService, JWTService, ProjectService } = await import(
    '../../meta/index.js'
  );

  return {
    authService: new AuthService(fastify.knex),
    jwtService: new JWTService(fastify),
    projectService: new ProjectService(fastify.knex, core, env)
  };
}
