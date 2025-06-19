// File: frontend/src/app/sys/factories/helpers.ts

import type { Helpers } from '../../types/index.js';

export async function helpersFactory(): Promise<Required<Helpers>> {
  console.log(`Creating 'Helpers' object`);

  const helpers = {} as Helpers;

  const [
    { appHelpersFactory },
    { canvasHelpersFactory },
    { dataHelperFactory },
    { mathHelpersFactory },
    { timeHelpersFactory }
  ] = await Promise.all([
    import('../../core/helpers/app.js'),
    import('../../core/helpers/canvas.js'),
    import('../../core/helpers/data.js'),
    import('../../core/helpers/math.js'),
    import('../../core/helpers/time.js')
  ]);

  helpers.app = appHelpersFactory();
  helpers.canvas = canvasHelpersFactory();
  helpers.data = await dataHelperFactory();
  helpers.math = mathHelpersFactory();
  helpers.time = timeHelpersFactory();

  console.log(`Helpers object has been successfully created`);

  return helpers;
}
