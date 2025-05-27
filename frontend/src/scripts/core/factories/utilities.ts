// File: frontend/src/scripts/core/factories/utilities.ts

import type { Utilities } from '../../types/index.js';

// ================================================== //
// ================================================== //

export async function utilitiesFactory(): Promise<Utilities> {
  try {
    console.log(`Creating 'Utilities' object.`);

    const { config } = await import('../../config/index.js');
    const regexData = config.data.regex;

    const utilities = {} as Utilities;
    const { typeguardFactory } = await import('../utils/typeguards.js');

    const typeguards: Utilities['typeguards'] = typeguardFactory(regexData);

    utilities.typeguards = typeguards;

    console.log(`'Utilities' object has been successfully created.`);

    return utilities;
  } catch (error) {
    console.error(
      `An unknown error occurred while attempting to create the 'Utilities' object:`,
      error
    );
    throw error;
  }
}
