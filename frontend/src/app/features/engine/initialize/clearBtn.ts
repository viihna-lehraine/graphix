// File: frontend/src/app/features/engine/initialize/clearBtn.ts

import type {
  Data,
  Helpers,
  Services,
  Utilities
} from '../../../types/index.js';

// ================================================== //

// TODO: CLEAR ANIMATIONS TOO!!!

export function initializeCanvasClearButton(
  data: Data,
  helpers: Helpers,
  services: Services,
  utils: Utilities
): void {
  const { canvasCache, errors, log, stateManager } = services;

  return errors.handleSync(() => {
    const clearBtnId = data.dom.ids.btns.clear;
    const btn = document.getElementById(clearBtnId) as HTMLButtonElement | null;

    if (!btn) throw new Error(`Canvas Clear Button not found!`);

    btn.addEventListener('click', () => {
      // 1. remove all text elements
      stateManager.clearCanvasAll();

      // 2. remove background image from state
      stateManager.setCanvasImage(undefined);
      stateManager.setCanvasAspectRatio(undefined);

      // 3. clear animations
      stateManager.clearCanvasAnimation();

      // 4. clear cached background image
      canvasCache.cachedBgImg = null;

      const canvas = utils.canvas.getCanvasElement();
      const ctx = helpers.canvas.get2DContext(canvas);
      utils.canvas.clearCanvas(ctx);

      log.info(
        `Canvas cleared and reset via StateManager.`,
        'initializeCanvasClearButton'
      );
    });

    log.debug(`Clear Button listener successfully attached.`);
  }, 'Unhandled Canvas Clear Button initialization error.');
}
