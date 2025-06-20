// File: frontend/src/app/sys/init/core.ts

import type { Core } from '../../types/index.js';

export async function initializeCore(): Promise<Required<Core>> {
  try {
    console.log(`Starting dependency initialization...`);

    const {
      initializeData,
      initializeEnvVars,
      initializeHelpers,
      initializeServices,
      initializeUtilities
    } = await import('./partials.js');

    let core = {} as Core;

    const data = await initializeData();
    core.data = data;
    const env = await initializeEnvVars();
    core.env = core.env;
    const helpers = await initializeHelpers();
    core.helpers = helpers;
    const utils = await initializeUtilities();
    core.utils = utils;
    const services = await initializeServices(data, env);
    core.services = services;

    console.info(`All dependencies initialized successfully.`);

    return core;
  } catch (error) {
    console.error(`Failed to initialize Core:`, error);
    throw new Error(`Core initialization failed`);
  }
}
