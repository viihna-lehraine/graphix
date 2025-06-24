// File: frontend/src/app/sys/init/core.ts

import type { Core } from '@index';

export async function initializeCore(): Promise<Required<Core>> {
  try {
    console.log(`Starting dependency initialization...`);

    const {
      initializeData,
      initializeEnvVars,
      initializeServices,
      initializeUtilities
    } = await import('./partials.js');

    let core = {} as Core;

    const data = await initializeData();
    core.data = data;
    const env_vars = await initializeEnvVars();
    core.env = env_vars;
    const utils = await initializeUtilities(data);
    core.utils = utils;
    const services = await initializeServices(data, env_vars, utils);
    core.services = services;

    console.info(`All dependencies initialized successfully.`);

    return core;
  } catch (error) {
    console.error(`Failed to initialize Core:`, error);
    throw new Error(`Core initialization failed`);
  }
}
