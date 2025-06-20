// File: frontend/src/app/features/engine/ui/initDownloadBtn.ts

import type { Core, Engine, LayerElement } from '../../../types/index.js';

export async function initializeDownloadBtn({
  core,
  engine
}: {
  core: Core;
  engine: Engine;
}): Promise<void> {
  const getElement = core.helpers.data.getElement;
  const ids = core.data.dom.ids;

  return core.services.errors.handleAsync(async () => {
    const btn = getElement(ids.downloadBtn) as HTMLButtonElement;

    btn.addEventListener('click', () => {
      const canvas = getElement(ids.canvas) as HTMLCanvasElement;
      const ctx = engine.renderingManager.getContext();

      if (!ctx) throw new Error(`Canvas 2D context not available.`);

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
          engine.renderingManager,
          fileName
        );
      } else {
        console.debug(`Running static image export pipeline...`);
        engine.ioFns.exportStaticFile(
          state.layers,
          width,
          height,
          core,
          engine.renderingManager,
          fileName
        );
      }
    });

    console.debug(`Download Button listener successfully attached.`);
  }, 'Unhandled Download Button initialization error.');
}
