// File: frontend/src/app/core/factories/helpers.ts

import type { Helpers } from '../../types/index.js';

// ================================================== //
// ================================================== //

export async function helpersFactory(): Promise<Required<Helpers>> {
  console.log(`Creating 'Helpers' object`);

  const helpers = {} as Helpers;

  const [
    { appHelpersFactory },
    { brandFactory },
    { dataHelperFactory },
    { mathHelpersFactory },
    { timeHelpersFactory }
  ] = await Promise.all([
    import('../helpers/app.js'),
    import('../helpers/brand.js'),
    import('../helpers/data.js'),
    import('../helpers/math.js'),
    import('../helpers/time.js')
  ]);

  helpers.app = appHelpersFactory();
  helpers.brand = brandFactory();
  helpers.data = dataHelperFactory();
  helpers.math = mathHelpersFactory();
  helpers.time = timeHelpersFactory();

  console.log(`Helpers object has been successfully created`);

  return helpers;
}
