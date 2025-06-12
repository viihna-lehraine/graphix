// File: frontend/src/app/sys/initialize.ts

import type {
  Core,
  Data,
  Helpers,
  Services,
  Utilities
} from '../types/index.js';
import { RenderingEngine } from '@engine/RenderingEngine.js';

export async function initializeData(): Promise<Required<Data>> {
  console.log(`Initializing Data object...`);

  try {
    const { data } = await import('@data/index.js');

    return data;
  } catch (error) {
    console.error(`Failed to initialize Data:`, error);
    throw new Error(`Data initialization failed`);
  }
}

async function initializeHelpers(): Promise<Required<Helpers>> {
  console.log(`Initializing Helpers object...`);

  try {
    const { helpersFactory } = await import('@core/factories/helpers.js');

    const helpers: Helpers = await helpersFactory();

    return helpers;
  } catch (error) {
    console.error(`Failed to initialize Helpers:`, error);
    throw new Error(`Helpers initialization failed`);
  }
}

async function initializeServices(
  data: Data,
  helpers: Helpers,
  utils: Utilities
): Promise<Required<Services>> {
  console.log(`Initializing Services object...`);

  try {
    const { serviceFactory } = await import('@core/factories/services.js');

    const services: Services = await serviceFactory(data, helpers, utils);

    return services;
  } catch (error) {
    console.error(`Failed to initialize Services:`, error);
    throw new Error(`Services initialization failed`);
  }
}

async function initializeUtilities(): Promise<Required<Utilities>> {
  console.log(`Initializing Utilities object...`);

  try {
    const { utilitiesFactory } = await import('@core/factories/utilities.js');
    const utilities: Utilities = await utilitiesFactory();

    return utilities;
  } catch (error) {
    throw new Error(`Utilities initialization failed.`);
  }
}

// ================================================== //

export async function initializeCore(): Promise<Core> {
  console.log(`Starting dependency initialization...`);

  let core = {} as Core;

  const data = await initializeData();
  core.data = data;

  const helpers = await initializeHelpers();
  core.helpers = helpers;

  const utils = await initializeUtilities();
  core.utils = utils;

  const services = await initializeServices(data, helpers, utils);
  core.services = services;

  const log = services.log;
  log.info(`All dependencies initialized successfully.`);

  return core;
}

export async function initializeRenderingEngine(
  ctx: CanvasRenderingContext2D,
  core: Core
): Promise<RenderingEngine> {
  const {
    services: { errors, log }
  } = core;

  return errors.handleAsync(async () => {
    log.info('Initializing the Rendering Engine...');
    const renderingEngine = RenderingEngine.getInstance(ctx, core);
    return renderingEngine;
  }, `Rendering Engine initialization failed.`);
}

export async function initializeUI(core: Core): Promise<RenderingEngine> {
  const {
    data: {
      dom: { ids }
    },
    services
  } = core;
  const { errors } = services;

  return errors.handleAsync(async () => {
    const canvas = document.getElementById(
      ids.canvas
    ) as HTMLCanvasElement | null;
    if (!canvas) throw new Error(`Canvas element not found in DOM!`);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error(`2D context not available for canvas!`);
    const container = document.getElementById(ids.canvasContainerDiv);
    if (!container) throw new Error(`Canvas container not found in DOM!`);

    const canvasRefs = { canvas, ctx };
    const renderingEngine = await initializeRenderingEngine(ctx, core);

    const { io } = await import('@engine/io.js');
    const { overlayFns: overlay } = await import('@engine/overlays.js');
    const { initializeCanvasUI } = await import('@engine/start.js');

    await initializeCanvasUI(io, overlay, core, renderingEngine);

    renderingEngine.autoResize({
      canvas,
      container,
      preserveAspectRatio: true
    });

    window.addEventListener('resize', () => {
      errors.handleSync(() => {
        renderingEngine.resizeCanvasToParent();
        renderingEngine.clearCanvas(canvasRefs.ctx);
        renderingEngine.drawBoundary(canvasRefs.ctx);
      }, 'Canvas resize/redraw failed');
    });

    return renderingEngine;
  }, `UI initialization failed.`);
}
