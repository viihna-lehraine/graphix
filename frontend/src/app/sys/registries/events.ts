// File: frontend/src/app/sys/registries/events.ts

import type { Data, Services } from '../../types/index.js';

type ListenerRegistration = (data: Data, services: Services) => void;

// ================================================== //
// ================================================== //

export const eventListeners: ListenerRegistration[] = [
  (_data, services) => {
    const { log } = services;
    log.info('Registering global event listeners...');

    window.addEventListener('resize', () => {
      // TODO: resize handler logic here
    });
  }
];

// ================================================== //

export function registerEventListeners(
  listeners: ListenerRegistration[],
  data: Data,
  services: Services
): void {
  const { errors } = services;
  const errorMsgs = data.msgs.errors;

  errors.handleAsync(
    async () => {
      listeners.forEach(listener => listener(data, services));
    },
    'An unknown error occurred while registering event listeners.',
    {
      context: 'application startup',
      fallback: 'n/a',
      userMessage: errorMsgs.unknownFatalError
    }
  );
}
