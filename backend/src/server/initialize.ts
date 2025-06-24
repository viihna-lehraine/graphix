// File: backend/src/server/initialize.ts

import type {
  Core,
  Data,
  EnvironmentVariables,
  Services
} from '../meta/index.js';
import type { FastifyInstance } from 'fastify';

export async function initializeServer(app: FastifyInstance): Promise<{
  core: Core;
  data: Data;
  env: EnvironmentVariables;
  services: Services;
}> {
  console.log('Initializing server...');

  const { createCore, createData, createEnvVars, createServices } =
    await import('./partials/factories.js');
  const { registerPlugins, registerRoutes, registerJwt } = await import(
    './partials/registry.js'
  );

  const core = await createCore();
  const data = await createData();
  const env = createEnvVars(core);
  const services = await createServices(app, core, env);

  await registerPlugins(app);
  await registerRoutes(app, core, env);
  await registerJwt(app, data, env);

  console.log('Server initialized successfully.');
  return {
    core,
    data,
    env,
    services
  };
}
