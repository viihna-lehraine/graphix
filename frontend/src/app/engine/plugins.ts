// File: frontend/src/app/engine/plugins.ts

import type { RedrawPlugin } from '../meta/index.js';

export const animatedImageRedrawPlugin: RedrawPlugin = (ctx, core) => {
  const state = core.services.stateManager.getCanvas();

  state.layers.forEach(layer => {
    if (
      layer.kind === 'image' &&
      core.utils.typeguards.isImageLayer(layer) &&
      layer.element.kind === 'animated_image'
    ) {
      const elem = layer.element;
      const frame = elem.gifFrames[elem.currentFrame];
      if (!frame) return;
      ctx.putImageData(frame.imageData, elem.position.x, elem.position.y);
    }
  });
};
