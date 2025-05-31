// File: frontend/src/app/features/canvas/ui/btns/clear.ts

import type {
  Data,
  MainCanvasFunctions,
  Services
} from '../../../../types/index.js';

// ================================================== //
// ================================================== //

export function initializeCanvasClearButton(
  data: Data,
  mainCanvasFns: MainCanvasFunctions,
  services: Services
): void {
  const { errors, log } = services;

  return errors.handleSync(() => {
    const clearBtnId = data.dom.ids.btns.clear;
    const btn = document.getElementById(clearBtnId) as HTMLButtonElement | null;

    if (!btn) throw new Error(`Canvas Clear Button not found!`);

    const ctx = mainCanvasFns.get2DContext(
      mainCanvasFns.getMainCanvas(data, services),
      services
    );

    btn.addEventListener('click', () => {
      mainCanvasFns.clearCanvas(ctx, services);
      log.info(`Canvas cleared successfully.`);

      mainCanvasFns.drawBoundary(ctx, services);
      log.info(`Canvas boundary has been redrawn.`);
    });

    services.log.debug(`Clear Button listener successfully attached.`);
  }, 'Unhandled Canvas Clear Button initialization error.');
}
