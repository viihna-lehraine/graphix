// File: fronend/src/app/sys/init/partials.ts

import type { Core, Data, EnvVars, Services, Utilities } from '@index';
import {
  AnimationManager,
  CacheManager,
  ErrorHandler,
  LayoutManager,
  RenderingManager,
  StateManager,
  StorageManager
} from '../../meta/index.js';

export const initializeData = async (): Promise<Data> => {
  try {
    console.log(`Initializing Data object...`);

    const { assetsData: assets } = await import('@data/assets.js');
    const { domClasses: classes } = await import('@data/dom/classes.js');
    const { defaultValues: defaults } = await import('@data/defaults.js');
    const { error_messages } = await import('@config/error_messages.js');
    const { file_paths } = await import('@data/file_paths.js');
    const { domIDs: ids } = await import('@data/dom/ids.js');
    const manifests = {
      asset: await (
        await import('@config/manifest.browser.js')
      ).loadAssetManifest()
    };
    const { regex } = await import('@data/regex.js');
    const { storage_keys } = await import('@data/storage_keys.js');

    return {
      assets,
      classes,
      defaults,
      error_messages,
      file_paths,
      manifests,
      ids,
      regex,
      storage_keys
    } as const;
  } catch (error) {
    console.error('Error loading app data > (initializeData):', error);
    throw new Error('Failed to load application data > (initializeData)');
  }
};

export async function initializeEnvVars(): Promise<EnvVars> {
  try {
    console.log(`Initializing Environment Variables...`);

    const { env_vars } = await import('@config/env/vars.js');

    return env_vars;
  } catch (error) {
    console.error('Error loading environment variables:', error);
    throw new Error('Failed to load environment variables');
  }
}

export async function initializeRenderingManager(
  ctx: CanvasRenderingContext2D,
  animationManager: AnimationManager,
  core: Core
): Promise<RenderingManager> {
  return core.services.errors.handleAsync(async () => {
    console.debug('Initializing the Rendering Engine...');

    const renderingEngine = RenderingManager.getInstance(
      ctx,
      animationManager,
      core
    );

    return renderingEngine;
  }, `Rendering Engine initialization failed.`);
}

export async function initializeServices(
  data: Data,
  env_vars: EnvVars,
  utils: Utilities
): Promise<Required<Services>> {
  console.debug(`Initializing Services object...`);

  try {
    console.log(`Initializing the core.services object...`);

    const services = {} as Services;

    services.errors = ErrorHandler.getInstance(data, utils);
    services.storageManager = await StorageManager.getInstance();
    services.stateManager = StateManager.getInstance(
      data,
      env_vars,
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

export async function initializeUtilities(
  data: Data
): Promise<Required<Utilities>> {
  try {
    console.log(`Creating 'Utilities' object.`);

    const { utilityFactory } = await import('@utils/main.js');

    const utils = utilityFactory(data);

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
