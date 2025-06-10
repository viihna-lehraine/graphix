// File: frontend/src/app/core/factories/services.ts

import type { Data, Helpers, Services } from '../../types/index.js';
import {
  AnimationGroupManager,
  CacheManager,
  ErrorHandler,
  Logger,
  ResizeManager,
  StateManager,
  StorageManager
} from '../services/index.js';

// ================================================== //

export async function serviceFactory(
  data: Data,
  helpers: Helpers
): Promise<Required<Services>> {
  console.log(`Starting service factory...`);
  const services = {} as Services;

  console.log(`Initializing Logger, ErrorHandler, and StateManager services`);

  services.log = Logger.getInstance(helpers);
  services.errors = ErrorHandler.getInstance(services.log);
  services.storageManager = await StorageManager.getInstance();
  services.stateManager = StateManager.getInstance(
    data,
    services.errors,
    services.log
  );
  services.cache = CacheManager.getInstance(services.errors, services.log);
  services.resizeManager = ResizeManager.getInstance(
    services.errors,
    services.log
  );
  services.animationGroupManager = AnimationGroupManager.getInstance();

  if (!services.log || !services.errors) {
    throw new Error(`Logger and/or ErrorHandler failed to initialize.`);
  }

  return services;
}
