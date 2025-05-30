// File: frontend/src/app/sys/registry.ts

import type { Data, ListenerRegistration, Services } from '../types/index.js';

// ================================================== //
// ================================================== //

export async function registerEventListeners(
  registrations: ListenerRegistration[],
  data: Data,
  services: Services
): Promise<void> {
  const { errors } = services;
  const errorMsgs = data.msgs.errors;

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
