// File: frontend/src/app/sys/factories/utilities.ts

import type {
  DataUtils,
  DomUtils,
  MathUtils,
  Utilities,
  Typeguards
} from '../../types/index.js';

export async function utilitiesFactory(): Promise<Required<Utilities>> {
  try {
    console.log(`Creating 'Utilities' object.`);

    const utils = {} as Utilities;

    const { dataUtilityFactory } = await import('../../core/utils/data.js');
    const { domUtilityFactory } = await import('../../core/utils/dom.js');
    const { mathUtilityFactory } = await import('../../core/utils/math.js');
    const { typeguardFactory } = await import('../../core/utils/typeguards.js');

    const typeguards: Typeguards = typeguardFactory();

    const dataUtils: DataUtils = dataUtilityFactory();
    const domUtils: DomUtils = domUtilityFactory();
    const mathUtils: MathUtils = mathUtilityFactory();

    utils.data = dataUtils;
    utils.dom = domUtils;
    utils.math = mathUtils;
    utils.typeguards = typeguards;

    console.log(`'Utilities' object has been successfully created.`);

    return utils;
  } catch (error) {
    throw new Error(
      `Failed to create 'Utilities' object: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}
