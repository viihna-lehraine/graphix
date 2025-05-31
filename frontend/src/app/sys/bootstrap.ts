// File: frontend/src/app/sys/bootstrap.ts

import type { Services } from '../types/index.js';

// ================================================== //
// ================================================== //

async function setGlobalErrorHandlers(services: Services): Promise<void> {
  const { log } = services;

  log.info(`Registering global error handlers`);

  try {
    window.onerror = function (message, source, lineno, colno, error) {
      console.log(
        `Unhandled error: ${message} at ${source}:${lineno}:${colno}`
      );
      if (error && error.stack) {
        console.log(`Stack trace:\n${error.stack}`);
      }
      return false;
    };
    window.addEventListener('unhandledrejection', event => {
      console.log(`Unhandled promise rejection: ${event.reason}`);
    });
  } catch (error) {
    log.error(
      `Failed to register global error handlers:`,
      error instanceof Error ? error.message : String(error)
    );
    throw new Error(`Global error handler registration failed.`);
  }
}

// ================================================== //
// ================================================== //

export async function bootstrap(services: Services): Promise<void> {
  await setGlobalErrorHandlers(services);
}
