// File: frontend/src/app/core/factories/services.ts

import type { Helpers, Services } from '../../types/index.js';
import { ErrorHandler, Logger, StateManager } from '../services/index.js';

// ================================================== //
// ================================================== //

export function serviceFactory(helpers: Helpers): Services {
  console.log(`Starting service factory...`);

  const services = {} as Services;

  console.log(`Initializing Logger, ErrorHandler, and StateManager services`);
  services.log = Logger.getInstance(helpers);
  services.errors = ErrorHandler.getInstance(services.log);
  services.stateManager = StateManager.getInstance(
    services.errors,
    helpers,
    services.log
  );

  if (!services.log || !services.errors) {
    throw new Error(`Logger and/or ErrorHandler failed to initialize.`);
  }

  return services;
}
