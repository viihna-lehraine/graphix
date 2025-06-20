// File: fronend/src/app/sys/init/partials.ts

import type {
  Core,
  Data,
  DataUtils,
  DomUtils,
  EnvVars,
  Helpers,
  Services,
  Typeguards,
  Utilities
} from '../../types/index.js';
import { RenderingManager } from '../../types/index.js';
import {
  AnimationGroupManager,
  CacheManager,
  ErrorHandler,
  LayoutManager,
  StateManager,
  StorageManager
} from '../../types/index.js';

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

export async function initializeEnvVars(): Promise<Required<EnvVars>> {
  console.log(`Initializing EnvVars object...`);

  try {
    const { env } = await import('../../config/env_vars.js');

    return env;
  } catch (error) {
    console.error(`Failed to initialize EnvVars:`, error);
    throw new Error(`EnvVars initialization failed`);
  }
}

export async function initializeHelpers(): Promise<Required<Helpers>> {
  try {
    console.log(`Initializing Helpers object...`);

    const helpers = {} as Helpers;

    const [
      { appHelpersFactory },
      { canvasHelpersFactory },
      { dataHelperFactory },
      { mathHelpersFactory },
      { timeHelpersFactory }
    ] = await Promise.all([
      import('@core/helpers/app.js'),
      import('@core/helpers/canvas.js'),
      import('@core/helpers/data.js'),
      import('@core/helpers/math.js'),
      import('@core/helpers/time.js')
    ]);

    helpers.app = appHelpersFactory();
    helpers.canvas = canvasHelpersFactory();
    helpers.data = await dataHelperFactory();
    helpers.math = mathHelpersFactory();
    helpers.time = timeHelpersFactory();

    console.log(`Helpers object has been successfully created`);

    return helpers;
  } catch (error) {
    console.error(`Failed to initialize Helpers:`, error);
    throw new Error(`Helpers initialization failed`);
  }
}

export async function initializeRenderingManager(
  ctx: CanvasRenderingContext2D,
  animationGroupManager: AnimationGroupManager,
  core: Core
): Promise<RenderingManager> {
  return core.services.errors.handleAsync(async () => {
    console.debug('Initializing the Rendering Engine...');
    const renderingEngine = RenderingManager.getInstance(
      ctx,
      core,
      animationGroupManager
    );

    return renderingEngine;
  }, `Rendering Engine initialization failed.`);
}

export async function initializeServices(
  data: Data,
  env: EnvVars
): Promise<Required<Services>> {
  console.debug(`Initializing Services object...`);

  try {
    const services = {} as Services;

    console.log(`Initializing the core.services object...`);

    services.errors = ErrorHandler.getInstance();
    services.storageManager = await StorageManager.getInstance();
    services.stateManager = StateManager.getInstance(
      data,
      env,
      services.errors
    );
    services.cache = CacheManager.getInstance(services.errors);
    services.layoutManager = LayoutManager.getInstance(services.errors);

    return services;
  } catch (error) {
    console.error(`Service Factory execution failed:`, error);
    throw new Error(
      `Failed to initialize services: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

export async function initializeUtilities(): Promise<Required<Utilities>> {
  try {
    console.log(`Creating 'Utilities' object.`);

    const utils = {} as Utilities;

    const { dataUtilityFactory } = await import('@core/utils/data.js');
    const { domUtilityFactory } = await import('@core/utils/dom.js');
    const { typeguardFactory } = await import('@core/utils/typeguards.js');

    const typeguards: Typeguards = typeguardFactory();

    const dataUtils: DataUtils = dataUtilityFactory();
    const domUtils: DomUtils = domUtilityFactory();

    utils.data = dataUtils;
    utils.dom = domUtils;
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
