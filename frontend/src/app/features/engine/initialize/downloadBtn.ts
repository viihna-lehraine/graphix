// File: frontend/src/app/features/engine/initialize/downloadBtn.ts

import type {
  CanvasIOFunctions,
  Data,
  Helpers,
  Services,
  Utilities
} from '../../../types/index.js';

export function initializeCanvasDownloadButton(
  data: Data,
  canvasIoFns: CanvasIOFunctions,
  helpers: Helpers,
  services: Services,
  utils: Utilities
): void {
  const { errors } = services;
  const log = services.log;

  return errors.handleSync(() => {
    const btnId = data.dom.ids.btns.download;
    const btn = document.getElementById(btnId) as HTMLButtonElement | null;

    if (!btn) throw new Error(`Download button not found!`);

    btn.addEventListener('click', () => {
      const canvas = utils.canvas.getCanvasElement();
      const ctx = helpers.canvas.get2DContext(canvas);

      if (!ctx) {
        throw new Error(`Canvas 2D context not available.`);
        return;
      }

      const state = services.stateManager.getCanvas();
      const hasAnimatedLayer = state.layers.some(layer => layer.type === 'gif');

      const width = canvas.width;
      const height = canvas.height;
      const frameCount = data.config.default.animation.frameCount;
      const fileName = data.config.default.fileName || 'default.png';

      if (hasAnimatedLayer) {
        log.info(`AnimationLayer(s) detected - running GIF export pipeline...`);
        canvasIoFns.download.exportGif(
          state.layers,
          width,
          height,
          frameCount,
          fileName,
          utils
        );
      } else {
        log.info(`Running static image export pipeline...`);
        canvasIoFns.download.exportStaticFile(
          state.layers,
          width,
          height,
          fileName,
          utils
        );
      }
    });

    log.debug(`Download Button listener successfully attached.`);
  }, 'Unhandled Download Button initialization error.');
}
