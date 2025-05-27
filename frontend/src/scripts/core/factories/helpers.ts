// File: frontend/src/scripts/core/factories/helpers.ts

import type { Helpers } from '../../types/index.js';

// ================================================== //
// ================================================== //

export async function helpersFactory(): Promise<Helpers> {
  console.log(`Creating 'Helpers' object`);
  const helpers = {} as Helpers;

  const [{ appHelpersFactory }, { brandFactory }, { mathHelpersFactory }] = await Promise.all([
    import('../helpers/app.js'),
    import('../helpers/brand.js'),
    import('../helpers/math.js')
  ]);

  helpers.app = appHelpersFactory();
  helpers.brand = brandFactory();
  helpers.math = mathHelpersFactory();

  console.log(`Helpers object has been successfully created`);

  return helpers;
}
