// File: fronend/src/app/sys/init/partials.ts

import type { Core, Data, Services, Utilities } from '@meta/index.js';
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

    const { assetsData: assets } = await import('../../data/assets.js');
    const { domClasses: classes } = await import('../../data/dom/classes.js');
    const { defaultValues: defaults } = await import('../../data/defaults.js');
    const { env_vars } = await import('../../config/environment/vars.js');
    const { error_messages } = await import('../../config/error_messages.js');
    const { file_paths } = await import('../../data/file_paths.js');
    const { domIDs: ids } = await import('../../data/dom/ids.js');
    const manifests = {
      asset: await (
        await import('../../config/manifest.js')
      ).loadAssetManifest()
    };
    const { regex } = await import('../../data/regex.js');
    const { storage_keys } = await import('../../data/storage_keys.js');

    return {
      assets,
      classes,
      defaults,
      env_vars,
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

export async function initializeRenderingManager(
  ctx: CanvasRenderingContext2D,
  animationGroupManager: AnimationManager,
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
  utils: Utilities
): Promise<Required<Services>> {
  console.debug(`Initializing Services object...`);

  try {
    console.log(`Initializing the core.services object...`);

    const services = {} as Services;

    services.errors = ErrorHandler.getInstance(data, utils);
    services.storageManager = await StorageManager.getInstance();
    services.stateManager = StateManager.getInstance(data, services.errors);
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

    const { utilityFactory } = await import('src/app/utils/main.js');

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
