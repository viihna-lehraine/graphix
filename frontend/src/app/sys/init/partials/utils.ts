// File: frontend/src/app/sys/init/partials/utils.ts

import type { Utilities } from '../../../types/index.js';

export async function initializeUtilities(): Promise<Required<Utilities>> {
  console.log(`Initializing Utilities object...`);

  try {
    const { utilitiesFactory } = await import('@core/factories/utilities.js');
    const utilities: Utilities = await utilitiesFactory();

    return utilities;
  } catch (error) {
    throw new Error(`Utilities initialization failed.`);
  }
}
