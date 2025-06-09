// File: frontend/src/app/core/factories/services.ts

import type { Data, Helpers, Services } from '../../types/index.js';
import { AnimationGroupManager } from '../services/dom/AnimationGroupManager.js';
import { CanvasCacheService } from '../services/CanvasCacheService.js';
import { ErrorHandler, Logger } from '../services/index.js';
import { ResizeManager } from '../services/dom/ResizeManager.js';
import { StateManager } from '../services/state/StateManager.js';

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
  services.stateManager = StateManager.getInstance(
    data,
    services.errors,
    services.log
  );
  services.canvasCache = CanvasCacheService.getInstance(
    services.errors,
    services.log
  );
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
