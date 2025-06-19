// File: frontend/src/app/sys/registries/events.ts

import type { Core, ListenerRegistration } from '../../types/index.js';
import { RenderingEngine } from '@engine/RenderingEngine.js';

export const eventListeners: ListenerRegistration[] = [
  (core: Core, renderingEngine: RenderingEngine) => {
    window.addEventListener('keydown', (event: KeyboardEvent) => {
      if (!core) {
        console.warn(
          'Core is not initialized, skipping event listener registration.'
        );
        return;
      }

      if (
        event.key === 'Delete' &&
        core.services.stateManager.getCanvas().selectedLayerIndex !== null
      ) {
        const nth = core.services.stateManager.getCanvas().selectedLayerIndex!;
        const found = renderingEngine.getNthTextElement(nth);

        if (found) {
          core.services.stateManager.removeTextElement(
            core.services.stateManager.getCanvas().layers.indexOf(found.layer)
          );

          // clear the selection after deletion:
          core.services.stateManager.setSelectedLayerIndex(null);
          console.debug(
            `Deleted text element at [layer: ${core.services.stateManager.getCanvas().layers.indexOf(found.layer)}, elem: ${found.elemIndex}]`
          );
        }
      }
    });
  }
];

export async function registerEventListeners(
  listeners: ListenerRegistration[],
  core: Core,
  renderingEngine: RenderingEngine
): Promise<void> {
  return core.services.errors.handleAsync(
    async () => {
      listeners.forEach(listener => listener(core, renderingEngine));
    },
    'An unknown error occurred while registering event listeners.',
    {
      context: 'application startup',
      fallback: 'n/a',
      userMessage: core.data.msgs.errors.unknownFatalError
    }
  );
}
