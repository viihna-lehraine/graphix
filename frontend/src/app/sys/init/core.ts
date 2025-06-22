// File: frontend/src/app/sys/init/core.ts

import type { Core } from '@meta/index.js';

export async function initializeCore(): Promise<Required<Core>> {
  try {
    console.log(`Starting dependency initialization...`);

    const { initializeData, initializeServices, initializeUtilities } =
      await import('./partials.js');

    let core = {} as Core;

    const data = await initializeData();
    core.data = data;
    const utils = await initializeUtilities(data);
    core.utils = utils;
    const services = await initializeServices(data, utils);
    core.services = services;

    console.info(`All dependencies initialized successfully.`);

    return core;
  } catch (error) {
    console.error(`Failed to initialize Core:`, error);
    throw new Error(`Core initialization failed`);
  }
}
