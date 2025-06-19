// File: frontend/src/app/features/engine/ui/init/clearBtn.ts

import type { Core, Engine } from '../../../../types/index.js';

export async function initializeClearBtn({
  core,
  engine
}: {
  core: Core;
  engine: Engine;
}): Promise<void> {
  if (core.data.flags.false) console.debug(`NO_OP PRINT: ${engine}`);

  return core.services.errors.handleAsync(async () => {
    const btn = document.getElementById(
      core.data.dom.ids.clearBtn
    ) as HTMLButtonElement | null;

    if (!btn) throw new Error(`Canvas Clear Button not found!`);

    btn.addEventListener('click', () => {
      // 1. remove all text elements
      core.services.stateManager.clearCanvasAll();

      // 2. remove background image from state
      core.services.stateManager.setCanvasImage(undefined);
      core.services.stateManager.setCanvasAspectRatio(undefined);

      // 3. clear animations
      core.services.stateManager.clearCanvasAnimation();

      // 4. clear cached background image
      core.services.cache.cachedBgImg = null;
      const canvas = document.getElementById(
        core.data.dom.ids.canvas
      ) as HTMLCanvasElement | null;
      if (!canvas) {
        throw new Error(`Canvas element not found in DOM!`);
      }
      core.services.stateManager.clearCanvasAll();

      console.info(`Canvas cleared and reset via StateManager.`);
    });

    console.debug(`Clear Button listener successfully attached.`);
  }, 'Unhandled Canvas Clear Button initialization error.');
}
