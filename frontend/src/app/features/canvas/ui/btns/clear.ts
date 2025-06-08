// File: frontend/src/app/features/canvas/ui/btns/clear.ts

import type { Data, Services } from '../../../../types/index.js';

// ================================================== //

export function initializeCanvasClearButton(
  data: Data,
  services: Services
): void {
  const { errors, log, stateManager } = services;

  return errors.handleSync(() => {
    const clearBtnId = data.dom.ids.btns.clear;
    const btn = document.getElementById(clearBtnId) as HTMLButtonElement | null;

    if (!btn) throw new Error(`Canvas Clear Button not found!`);

    btn.addEventListener('click', () => {
      stateManager.clearCanvasAll();
      services.log.info(
        `Canvas cleared and reset via StateManager.`,
        'initializeCanvasClearButton'
      );
    });

    log.debug(`Clear Button listener successfully attached.`);
  }, 'Unhandled Canvas Clear Button initialization error.');
}
