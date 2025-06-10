// File: frontend/src/app/sys/registries/events.ts

import type { Core, ListenerRegistration } from '../../types/index.js';

export const eventListeners: ListenerRegistration[] = [
  (core: Core) => {
    const {
      services: { errors, log, stateManager }
    } = core;
    errors.handleSync(() => {
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
    }, 'Unhandled error during event listener registration.');
  }
];

// ================================================== //

export function registerEventListeners(
  listeners: ListenerRegistration[],
  core: Core
): void {
  const {
    data: { msgs },
    services: { errors }
  } = core;
  const errorMsgs = msgs.errors;

  errors.handleAsync(
    async () => {
      listeners.forEach(listener => listener(core));
    },
    'An unknown error occurred while registering event listeners.',
    {
      context: 'application startup',
      fallback: 'n/a',
      userMessage: errorMsgs.unknownFatalError
    }
  );
}
