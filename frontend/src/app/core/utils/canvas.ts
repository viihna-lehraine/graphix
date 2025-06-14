// File: frontend/src/app/core/utils/canvas.ts

import type {
  CanvasUtils,
  AnyLayer,
  TextLayerElement
} from '../../types/index.js';

export const canvasUtilityFactory = (): CanvasUtils => ({
  drawVisualLayersToContext(
    ctx: CanvasRenderingContext2D,
    layers: AnyLayer[]
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
            // Always fills canvas
            if (
              layer.element &&
              layer.element.complete &&
              layer.element.naturalWidth > 0
            ) {
              ctx.drawImage(
                layer.element,
                0,
                0,
                ctx.canvas.width,
                ctx.canvas.height
              );
            }
            break;

          case 'image':
            // One or more sticker elements, each with position/scale/rotation
            for (const elem of layer.elements) {
              ctx.save();
              ctx.translate(elem.position.x, elem.position.y);
              ctx.rotate(((elem.rotation ?? 0) * Math.PI) / 180);
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
            }
            break;

          case 'overlay':
            // Always fills canvas, can have transparency
            ctx.globalAlpha = layer.opacity ?? 0.5;
            if (
              layer.element &&
              layer.element.complete &&
              layer.element.naturalWidth > 0
            ) {
              ctx.drawImage(
                layer.element,
                0,
                0,
                ctx.canvas.width,
                ctx.canvas.height
              );
            }
            break;

          // Add more cases as needed (e.g., text, filters, etc)
          default:
            // Optionally call your current per-element logic if you have unknowns
            break;
        }

        ctx.restore();
      });

    ctx.globalAlpha = 1.0;
    ctx.globalCompositeOperation = 'source-over';
  },

  findNthTextElement(
    layers: AnyLayer[],
    n: number
  ): { layer: AnyLayer; elemIndex: number } | null {
    let count = 0;
    for (const layer of layers) {
      for (let i = 0; i < layer.elements.length; ++i) {
        if (layer.elements[i].kind === 'text') {
          if (count === n) return { layer, elemIndex: i };
          count++;
        }
      }
    }
    return null;
  },

  findTextElements(
    layers: AnyLayer[]
  ): { elem: TextLayerElement; layerIndex: number; elemIndex: number }[] {
    const results: {
      elem: TextLayerElement;
      layerIndex: number;
      elemIndex: number;
    }[] = [];
    layers.forEach((layer, layerIndex) => {
      layer.elements.forEach((element, elemIndex) => {
        if (element.kind === 'text') {
          results.push({ elem: element, layerIndex, elemIndex });
        }
      });
    });
    return results;
  }
});
