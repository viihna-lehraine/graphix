// File: frontend/src/app/sys/init/partials/services.ts

import type {
  Data,
  EnvVars,
  Helpers,
  Utilities,
  Services
} from '../../../types/index.js';

export async function initializeServices(
  data: Data,
  env: EnvVars,
  helpers: Helpers,
  utils: Utilities
): Promise<Required<Services>> {
  console.log(`Initializing Services object...`);

  try {
    const { serviceFactory } = await import('@core/factories/services.js');

    const services: Services = await serviceFactory(data, env, helpers, utils);

    return services;
  } catch (error) {
    console.error(`Failed to initialize Services:`, error);
    throw new Error(`Services initialization failed`);
  }
}
