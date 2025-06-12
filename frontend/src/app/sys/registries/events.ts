// File: frontend/src/app/sys/registries/events.ts

import type { Core, ListenerRegistration } from '../../types/index.js';

export const eventListeners: ListenerRegistration[] = [
  (core: Core) => {
    const {
      services: { errors, log, stateManager },
      utils
    } = core;
    errors.handleSync(() => {
      log.info(
        'Registering global event listeners...',
        'registries > events > eventListeners'
      );

      window.addEventListener('keydown', (event: KeyboardEvent) => {
        if (
          event.key === 'Delete' &&
          stateManager.getCanvas().selectedLayerIndex !== null
        ) {
          const nth = stateManager.getCanvas().selectedLayerIndex!;
          const found = utils.canvas.findNthTextElement(
            stateManager.getCanvas().layers,
            nth
          );

          if (found) {
            stateManager.removeTextElement(
              stateManager.getCanvas().layers.indexOf(found.layer),
              found.elemIndex
            );
            // Optionally clear the selection after deletion:
            stateManager.setSelectedLayerIndex(null);
            log.info(
              `Deleted text element at [layer: ${stateManager.getCanvas().layers.indexOf(found.layer)}, elem: ${found.elemIndex}]`,
              'event:keydown:Delete'
            );
          }
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
