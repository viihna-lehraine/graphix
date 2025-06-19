// File: frontend/src/app/features/engine/ui/init/downloadBtn.ts

import type { Core, Engine, LayerElement } from '../../../../types/index.js';

export async function initializeDownloadBtn({
  core,
  engine
}: {
  core: Core;
  engine: Engine;
}): Promise<void> {
  return core.services.errors.handleAsync(async () => {
    const btn = document.getElementById(
      core.data.dom.ids.downloadBtn
    ) as HTMLButtonElement | null;

    if (!btn) throw new Error(`Download button not found!`);

    btn.addEventListener('click', () => {
      const canvas = document.getElementById(
        core.data.dom.ids.canvas
      ) as HTMLCanvasElement | null;
      if (!canvas) {
        throw new Error(`Canvas element not found in DOM!`);
      }
      const ctx = core.helpers.canvas.get2DContext(canvas);

      if (!ctx) {
        throw new Error(`Canvas 2D context not available.`);
        return;
      }

      const state = core.services.stateManager.getCanvas();
      const hasAnimatedLayer = state.layers.some(
        layer =>
          layer.kind === 'image' &&
          (layer.element as LayerElement).kind === 'animated_image'
      );

      const width = canvas.width;
      const height = canvas.height;
      const frameCount = core.data.config.defaults.animation.frameCount;
      const fileName = core.data.config.defaults.fileName || 'default.png';

      if (hasAnimatedLayer) {
        console.debug(
          `AnimationLayer(s) detected - running GIF export pipeline...`
        );
        engine.ioFns.exportGif(
          state.layers,
          width,
          height,
          frameCount,
          core,
          fileName
        );
      } else {
        console.debug(`Running static image export pipeline...`);
        engine.ioFns.exportStaticFile(
          state.layers,
          width,
          height,
          core,
          fileName
        );
      }
    });

    console.debug(`Download Button listener successfully attached.`);
  }, 'Unhandled Download Button initialization error.');
}
