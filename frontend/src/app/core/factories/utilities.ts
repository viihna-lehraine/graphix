// File: frontend/src/app/core/factories/utilities.ts

import type { Utilities } from '../../types/index.js';

// ================================================== //
// ================================================== //

export async function utilitiesFactory(): Promise<Utilities> {
  try {
    console.log(`Creating 'Utilities' object.`);

    const { data } = await import('../../data/index.js');
    const regexData = data.config.regex;

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
