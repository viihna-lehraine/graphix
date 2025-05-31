// File: frontend/src/app/sys/initialize.ts

import type {
  AppDependencies,
  CanvasFunctions,
  Data,
  Helpers,
  Services,
  Utilities
} from '../types/index.js';
import { ResizeManager } from '../dom/ResizeManager.js';
import { StateManager } from '../state/StateManager.js';

// ================================================== //
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
  helpers: Helpers
): Promise<Required<Services>> {
  console.log(`Initializing Services object...`);

  try {
    const { serviceFactory } = await import('../core/factories/services.js');

    const services: Services = serviceFactory(helpers);

    return services;
  } catch (error) {
    console.error(`Failed to initialize Services:`, error);
    throw new Error(`Services initialization failed`);
  }
}

// ================================================== //

async function initializeUtilities(
  services: Services
): Promise<Required<Utilities>> {
  console.log(`Initializing Utilities object...`);

  return await services.errors.handleAsync(async () => {
    const { utilitiesFactory } = await import('../core/factories/utilities.js');
    const utilities: Utilities = await utilitiesFactory(services);

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

  const helpers = await initializeHelpers();
  deps.helpers = helpers;

  const services = await initializeServices(helpers);
  deps.services = services;

  const utilities = await initializeUtilities(services);
  deps.utilities = utilities;

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
    const { ResizeManager } = await import('../dom/ResizeManager.js');
    const resizeManager = ResizeManager.getInstance(services);

    return resizeManager;
  }, `ResizeManager initialization failed.`);
}

// ================================================== //

export async function initializeStateManager(
  data: Data,
  deps: AppDependencies
): Promise<StateManager> {
  const { services } = deps;
  const { errors } = services;

  return errors.handleAsync(async () => {
    const stateManager = StateManager.getInstance(
      data,
      services.errors,
      services.log
    );

    return stateManager;
  }, `StateManager initialization failed.`);
}

// ================================================== //

export async function initializeUI(
  data: Data,
  deps: AppDependencies
): Promise<Required<CanvasFunctions>> {
  const { services, utilities } = deps;
  const { errors } = services;

  return errors.handleAsync(async () => {
    const { mainCanvasFns } = await import('../features/canvas/main.js');
    const canvasRefs = mainCanvasFns.getCanvasRefs(data, services);

    const { canvasIoFns } = await import('../features/canvas/io/index.js');
    const { canvasUiFns } = await import('../features/canvas/ui/index.js');

    await canvasUiFns.initialize(canvasIoFns, data, mainCanvasFns, services);

    const { canvas } = canvasRefs;
    const container = document.getElementById(
      data.dom.ids.divs.canvasContainer
    );

    if (canvas && container) {
      utilities.canvas.autoResize(
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
        mainCanvasFns.resizeCanvasToParent(data, services);
        mainCanvasFns.clearCanvas(canvasRefs.ctx, services);
        mainCanvasFns.drawBoundary(canvasRefs.ctx, services);
      }, 'Canvas resize/redraw failed');
    });

    const canvasFns = {
      main: mainCanvasFns,
      io: canvasIoFns,
      ui: canvasUiFns
    } as const satisfies CanvasFunctions;

    return canvasFns;
  }, `UI initialization failed.`);
}
