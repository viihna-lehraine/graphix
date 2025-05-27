// File: frontend/src/scripts/core/factories/services.ts

import type { Helpers, Services } from '../../types/index.js';
import { ErrorHandler, Logger } from '../services/index.js';

// ================================================== //
// ================================================== //

export function serviceFactory(helpers: Helpers): Services {
  console.log(`Starting service factory...`);

  const services = {} as Services;

  console.log(`Initializing Logger and ErrorHandler services`);
  services.log = Logger.getInstance(helpers);
  services.errors = ErrorHandler.getInstance(services.log);

  if (!services.log || !services.errors) {
    throw new Error(`Logger and/or ErrorHandler failed to initialize.`);
  }

  return services;
}
