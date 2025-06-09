// File: frontend/src/app/sys/registries/events.ts

import type { Data, Services } from '../../types/index.js';

type ListenerRegistration = (data: Data, services: Services) => void;

// ================================================== //
// ================================================== //

export const eventListeners: ListenerRegistration[] = [
  (_data, services) => {
    const { log, stateManager } = services;
    log.info(
      'Registering global event listeners...',
      'registries > events > eventListeners'
    );

    window.addEventListener('resize', () => {
      // TODO: resize handler logic here
    });

    window.addEventListener('keydown', (event: KeyboardEvent) => {
      if (
        event.key === 'Delete' &&
        stateManager.getCanvas().selectedLayerIndex !== null
      ) {
        const idx = stateManager.getCanvas().selectedLayerIndex!;
        stateManager.removeTextElement(idx);
        stateManager.getCanvas().selectedLayerIndex = null;
        log.info(
          `Deleted text element at index: ${idx}`,
          'event:keydown:Delete'
        );
      }
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
