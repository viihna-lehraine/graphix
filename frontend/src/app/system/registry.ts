// File: frontend/src/app/system/registry.ts

import type { Configuration, ListenerRegistration, Services } from '../types/index.js';

// ================================================== //
// ================================================== //

export async function registerEventListeners(
  registrations: ListenerRegistration[],
  config: Configuration,
  services: Services
): Promise<void> {
  const { errors } = services;
  const errorMsgs = config.msgs.errors;

  errors.handleAsync(
    async () => {
      registrations.forEach(reg => reg());
    },
    'An unknown error occurred while registering event listeners.',
    {
      context: 'application startup',
      fallback: 'n/a',
      userMessage: errorMsgs.unknownFatalError
    }
  );
}
