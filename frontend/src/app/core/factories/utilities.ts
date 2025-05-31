// File: frontend/src/app/core/factories/utilities.ts

import type {
  CanvasUtils,
  DOMUtils,
  Services,
  Typeguards,
  Utilities
} from '../../types/index.js';

// ================================================== //
// ================================================== //

export async function utilitiesFactory(
  services: Services
): Promise<Required<Utilities>> {
  const { errors, log } = services;

  return errors.handleAsync(async () => {
    log.info(`Creating 'Utilities' object.`);

    const { data } = await import('../../data/index.js');
    const regexData = data.config.regex;

    const utilities = {} as Utilities;
    const { canvasUtilityFactory } = await import('../utils/canvas.js');
    const { domUtilityFactory } = await import('../utils/dom.js');
    const { typeguardFactory } = await import('../utils/typeguards.js');

    const canvasUtils: CanvasUtils = canvasUtilityFactory(services);
    const domUtils: DOMUtils = domUtilityFactory();
    const typeguards: Typeguards = typeguardFactory(regexData);

    utilities.canvas = canvasUtils;
    utilities.dom = domUtils;
    utilities.typeguards = typeguards;

    log.info(`'Utilities' object has been successfully created.`);

    return utilities;
  }, `Utilities initialization failed.`);
}
