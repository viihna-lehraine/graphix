// File: frontend/src/app/sys/initialize.ts

import type {
  AppDependencies,
  Data,
  Helpers,
  Services,
  Utilities
} from '../types/index.js';
import { ResizeManager } from '../core/services/dom/ResizeManager.js';
import { textElementOverlayFns } from '../features/engine/overlays/textElement.js';

// ================================================== //

async function initializeHelpers(): Promise<Required<Helpers>> {
  console.log(`Initializing Helpers object...`);

  try {
    const { helpersFactory } = await import('../core/factories/helpers.js');

    const helpers: Helpers = await helpersFactory();

    return helpers;
  } catch (error) {
    console.error(`Failed to initialize Helpers:`, error);
    throw new Error(`Helpers initialization failed`);
  }
}

// ================================================== //

async function initializeServices(
  data: Data,
  helpers: Helpers
): Promise<Required<Services>> {
  console.log(`Initializing Services object...`);

  try {
    const { serviceFactory } = await import('../core/factories/services.js');

    const services: Services = await serviceFactory(data, helpers);

    return services;
  } catch (error) {
    console.error(`Failed to initialize Services:`, error);
    throw new Error(`Services initialization failed`);
  }
}

// ================================================== //

async function initializeUtilities(
  helpers: Helpers,
  services: Services
): Promise<Required<Utilities>> {
  console.log(`Initializing Utilities object...`);

  return await services.errors.handleAsync(async () => {
    const { utilitiesFactory } = await import('../core/factories/utilities.js');
    const utilities: Utilities = await utilitiesFactory(helpers, services);

    return utilities;
  }, `Utilities initialization failed.`);
}

// ================================================== //
// ================================================== //

export async function initializeAppDependencies(): Promise<
  Required<AppDependencies>
> {
  console.log(`Starting dependency initialization...`);

  let deps = {} as AppDependencies;

  const data = await initializeData();
  deps.data = data;

  const helpers = await initializeHelpers();
  deps.helpers = helpers;

  const services = await initializeServices(data, helpers);
  deps.services = services;

  const utils = await initializeUtilities(helpers, services);
  deps.utils = utils;

  const log = services.log;
  log.info(`All dependencies initialized successfully.`);

  return deps;
}

// ================================================== //

export async function initializeData(): Promise<Required<Data>> {
  console.log(`Initializing Data object...`);

  try {
    const { data } = await import('../data/index.js');

    return data;
  } catch (error) {
    console.error(`Failed to initialize Data:`, error);
    throw new Error(`Data initialization failed`);
  }
}

// ================================================== //

export async function initializeResizeManager(
  deps: AppDependencies
): Promise<ResizeManager> {
  const { services } = deps;
  const { errors } = services;

  return errors.handleAsync(async () => {
    const { ResizeManager } = await import(
      '../core/services/dom/ResizeManager.js'
    );
    const resizeManager = ResizeManager.getInstance(
      services.errors,
      services.log
    );

    return resizeManager;
  }, `ResizeManager initialization failed.`);
}

// ================================================== //

export async function initializeUI(
  data: Data,
  deps: Required<AppDependencies>
): Promise<void> {
  const { helpers, services, utils } = deps;
  const { errors } = services;

  return errors.handleAsync(async () => {
    const canvasRefs = utils.canvas.getRefs();

    const { canvasIoFns } = await import('../features/engine/io/index.js');
    const { initializeCanvasUI } = await import(
      '../features/engine/initialize/main.js'
    );

    await initializeCanvasUI(
      canvasIoFns,
      data,
      helpers,
      services,
      textElementOverlayFns,
      utils
    );

    const { canvas } = canvasRefs;
    const container = document.getElementById(
      data.dom.ids.divs.canvasContainer
    );

    if (canvas && container) {
      utils.canvas.autoResize(
        {
          canvas,
          container,
          preserveAspectRatio: true
        },
        services
      );
    }

    window.addEventListener('resize', () => {
      errors.handleSync(() => {
        utils.canvas.resizeCanvasToParent();
        utils.canvas.clearCanvas(canvasRefs.ctx);
        utils.canvas.drawBoundary(canvasRefs.ctx);
      }, 'Canvas resize/redraw failed');
    });
  }, `UI initialization failed.`);
}
