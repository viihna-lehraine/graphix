// File: frontend/src/app/core/utils/canvas.ts

import type {
  CanvasUtils,
  Layer,
  TextLayerElement,
  Typeguards
} from '../../types/index.js';

export const canvasUtilityFactory = (typeguards: Typeguards): CanvasUtils => ({
  drawVisualLayersToContext(
    ctx: CanvasRenderingContext2D,
    layers: Layer[]
  ): void {
    layers
      .slice()
      .sort((a, b) => a.zIndex - b.zIndex)
      .forEach(layer => {
        if (!layer.visible) return;

        ctx.save();
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = layer.opacity;

        switch (layer.kind) {
          case 'background':
            if (
              layer.element &&
              (layer.element as HTMLImageElement).complete &&
              (layer.element as HTMLImageElement).naturalWidth > 0
            ) {
              ctx.drawImage(
                layer.element as HTMLImageElement,
                0,
                0,
                ctx.canvas.width,
                ctx.canvas.height
              );
            }
            break;

          case 'image':
            const elem = layer.element;
            ctx.save();
            ctx.translate(elem.position.x, elem.position.y);

            let rotation = 0;
            if (elem.kind === 'static_image' || elem.kind === 'text') {
              rotation = typeof elem.rotation === 'number' ? elem.rotation : 0;
            } else if (elem.kind === 'animated_image') {
              if (
                elem.rotation &&
                typeof elem.rotation === 'object' &&
                'currentAngle' in elem.rotation
              ) {
                rotation = elem.rotation.currentAngle ?? 0;
              } else {
                rotation = 0;
              }
            }
            ctx.rotate((rotation * Math.PI) / 180);
            ctx.scale(elem.scale.x, elem.scale.y);

            if (
              elem.kind === 'static_image' &&
              elem.element &&
              elem.element.complete &&
              elem.element.naturalWidth > 0
            ) {
              ctx.drawImage(elem.element, 0, 0);
            }

            ctx.restore();
            break;

          case 'overlay':
            ctx.globalAlpha = layer.opacity ?? 0.5;
            if (
              layer.element &&
              (layer.element as HTMLImageElement).complete &&
              (layer.element as HTMLImageElement).naturalWidth > 0
            ) {
              ctx.drawImage(
                layer.element as HTMLImageElement,
                0,
                0,
                ctx.canvas.width,
                ctx.canvas.height
              );
            }
            break;
        }

        ctx.restore();
      });

    ctx.globalAlpha = 1.0;
    ctx.globalCompositeOperation = 'source-over';
  },

  findNthTextElement(
    layers: Layer[],
    n: number
  ): { layer: Layer; elemIndex: number } | null {
    let count = 0;
    for (const layer of layers) {
      if (typeguards.isImageLayer(layer) && layer.element.kind === 'text') {
        if (count === n) return { layer, elemIndex: 0 };
        count++;
      }
    }
    return null;
  },

  findTextElements(
    layers: Layer[]
  ): { elem: TextLayerElement; layerIndex: number; elemIndex: number }[] {
    const results: {
      elem: TextLayerElement;
      layerIndex: number;
      elemIndex: number;
    }[] = [];
    layers.forEach((layer, layerIndex) => {
      if (typeguards.isImageLayer(layer) && layer.element.kind === 'text') {
        results.push({
          elem: layer.element,
          layerIndex,
          elemIndex: 0
        });
      }
    });
    return results;
  }
});
