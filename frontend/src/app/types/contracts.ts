// File: frontend/src/app/types/contracts.ts

import type { ErrorHandlerOptions } from './application.js';

// ================================================== //
// ================================================== //

export interface ErrorHandlerServiceContract {
  handleAndReturn<T>(
    action: () => T | Promise<T>,
    errorMessage: string,
    options?: ErrorHandlerOptions
  ): T | Promise<T>;
  handleAsync<T>(
    action: () => Promise<T>,
    errorMessage: string,
    options?: ErrorHandlerOptions
  ): Promise<T>;
  handleSync<T>(action: () => T, errorMessage: string, options?: ErrorHandlerOptions): T;
}

/* --------------------------------------------------- */

export interface LoggerServiceContract {
  debug(message: string, caller?: string): void;
  error(message: string, caller?: string): void;
  info(message: string, caller?: string): void;
  warn(message: string, caller?: string): void;
}
