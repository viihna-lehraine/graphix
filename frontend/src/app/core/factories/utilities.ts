// File: frontend/src/app/core/factories/utilities.ts

import type {
  CanvasUtils,
  DataUtils,
  DomUtils,
  MathUtils,
  Services,
  Utilities
} from '../../types/index.js';

export async function utilitiesFactory(
  services: Services
): Promise<Required<Utilities>> {
  const { errors, log } = services;

  return errors.handleAsync(async () => {
    log.info(`Creating 'Utilities' object.`);

    const utils = {} as Utilities;
    const { canvasUtilityFactory } = await import('../utils/canvas.js');
    const { dataUtilityFactory } = await import('../utils/data.js');
    const { domUtilityFactory } = await import('../utils/dom.js');
    const { mathUtilityFactory } = await import('../utils/math.js');

    const canvasUtils: CanvasUtils = canvasUtilityFactory();
    const dataUtils: DataUtils = dataUtilityFactory();
    const domUtils: DomUtils = domUtilityFactory();
    const mathUtils: MathUtils = mathUtilityFactory();

    utils.canvas = canvasUtils;
    utils.data = dataUtils;
    utils.dom = domUtils;
    utils.math = mathUtils;

    log.info(`'Utilities' object has been successfully created.`);

    return utils;
  }, `Utilities initialization failed.`);
}
