// File: frontend/src/app/core/utils/canvas.ts

import type {
  Helpers,
  CanvasUtils,
  Services,
  VisualLayer
} from '../../types/index.js';

export const canvasUtilityFactory = (): CanvasUtils => ({
  drawVisualLayersToContext(
    ctx: CanvasRenderingContext2D,
    layers: VisualLayer[],
    helpers: Helpers,
    log: Services['log']
  ): void {
    layers
      .slice()
      .sort((a, b) => a.zIndex - b.zIndex)
      .forEach(layer => {
        if (!layer.visible) return;

        ctx.save();

        // default blend mode
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = layer.opacity;

        // apply transform
        const x = layer.position?.x ?? 0;
        const y = layer.position?.y ?? 0;
        const scaleX = layer.scale?.x ?? 1;
        const scaleY = layer.scale?.y ?? 1;
        const rotation = layer.rotation?.currentAngle ?? 0;

        ctx.translate(x, y);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.scale(scaleX, scaleY);

        switch (layer.type) {
          case 'gif': {
            const frame = layer.gifFrames[layer.currentFrame];
            if (frame && frame.imageData instanceof ImageData) {
              ctx.putImageData(frame.imageData, 0, 0);
            } else {
              log.warn(`GIF frame not found or invalid for layer ${layer.id}`);
            }
            break;
          }
          case 'image': {
            if (
              layer.element &&
              layer.element.complete &&
              layer.element.naturalWidth > 0
            ) {
              ctx.drawImage(layer.element, 0, 0);
            }
            break;
          }

          case 'overlay': {
            ctx.globalCompositeOperation = helpers.canvas.mapBlendMode(
              layer.blendMode
            );
            ctx.drawImage(layer.element, 0, 0);
            break;
          }

          case 'sticker': {
            ctx.drawImage(layer.element, 0, 0);
            break;
          }

          case 'video': {
            ctx.drawImage(layer.element, 0, 0);
            break;
          }

          case 'text': {
            // no draw here — text layers are drawn in drawTextAndSelection()
            break;
          }
        }

        ctx.restore();
      });

    ctx.globalAlpha = 1.0;
    ctx.globalCompositeOperation = 'source-over';
  }
});
