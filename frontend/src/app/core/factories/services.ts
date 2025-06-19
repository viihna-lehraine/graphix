// File: frontend/src/app/core/factories/services.ts

import type {
  Data,
  EnvVars,
  Helpers,
  Services,
  Utilities
} from '../../types/index.js';
import { AnimationGroupManager } from '@engine/AnimationGroupManager.js';
import { CacheManager } from '@core/services/CacheManager.js';
import { ErrorHandler } from '@core/services/ErrorHandler.js';
import { ResizeManager } from '@core/services/ResizeManager.js';
import { StateManager } from '@core/services/state/StateManager.js';
import { StorageManager } from '@core/services/storage/StorageManager.js';

export async function serviceFactory(
  data: Data,
  env: EnvVars,
  helpers: Helpers,
  utils: Utilities
): Promise<Required<Services>> {
  console.log(`Starting service factory...`);
  const services = {} as Services;

  console.log(`Initializing the ErrorHandler and StateManager services`);

  services.errors = ErrorHandler.getInstance();
  if (!services.errors) {
    throw new Error(`ErrorHandler failed to initialize.`);
  }

  services.storageManager = await StorageManager.getInstance();
  if (!services.storageManager) {
    throw new Error(`StorageManager failed to initialize.`);
  }

  services.stateManager = StateManager.getInstance(
    data,
    env,
    services.errors,
    helpers,
    utils
  );
  if (!services.stateManager) {
    throw new Error(`StateManager failed to initialize.`);
  }

  services.cache = CacheManager.getInstance(services.errors);
  if (!services.cache) {
    throw new Error(`CacheManager failed to initialize.`);
  }

  services.resizeManager = ResizeManager.getInstance(services.errors);
  if (!services.resizeManager) {
    throw new Error(`ResizeManager failed to initialize.`);
  }

  services.animationGroupManager = AnimationGroupManager.getInstance();
  if (!services.animationGroupManager) {
    throw new Error(`AnimationGroupManager failed to initialize.`);
  }

  return services;
}
