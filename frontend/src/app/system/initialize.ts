// File: frontend/src/app/system/initialize.ts

import type { Helpers, Services, Utilities } from '../types/index.js';

// ================================================== //
// ================================================== //

async function initializeHelpers(): Promise<Helpers> {
  console.log(`Initializing Helpers object...`);

  try {
    const { helpersFactory } = await import('../core/factories/helpers.js');

    const helpers: Helpers = await helpersFactory();

    return helpers;
  } catch (error) {
    console.error(`Failed to initialize Helpers:`, error);
    throw new Error(`Helpers initialization failed`);
  }
}

// ================================================== //

async function initializeServices(helpers: Helpers): Promise<Services> {
  console.log(`Initializing Services object...`);

  try {
    const { serviceFactory } = await import('../core/factories/services.js');

    const services: Services = serviceFactory(helpers);

    return services;
  } catch (error) {
    console.error(`Failed to initialize Services:`, error);
    throw new Error(`Services initialization failed`);
  }
}

// ================================================== //

async function initializeUtilities(services: Services): Promise<Utilities> {
  console.log(`Initializing Utilities object...`);

  return await services.errors.handleAsync(async () => {
    const { utilitiesFactory } = await import('../core/factories/utilities.js');
    const utilities: Utilities = await utilitiesFactory();

    return utilities;
  }, `Utilities initialization failed.`);
}

// ================================================== //
// ================================================== //

export async function initializeApp(): Promise<{
  helpers: Helpers;
  services: Services;
  utilities: Utilities;
}> {
  console.log(`Starting dependency initialization...`);

  const helpers = await initializeHelpers();
  const services = await initializeServices(helpers);
  const utilities = await initializeUtilities(services);

  const log = services.log;
  log.info(`All dependencies initialized successfully.`);

  return { helpers, services, utilities };
}
