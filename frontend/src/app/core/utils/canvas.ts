// File: frontend/src/app/core/utils/canvas.ts

import type {
  CanvasUtils,
  Layer,
  TextLayerElement
} from '../../types/index.js';

export const canvasUtilityFactory = (): CanvasUtils => ({
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

        for (const elem of layer.elements) {
          ctx.save();

          // per-element transform: position, rotation, scale
          ctx.translate(elem.position.x, elem.position.y);

          // --- rotation ---
          if (elem.kind === 'static_image' || elem.kind === 'text') {
            ctx.rotate(((elem.rotation ?? 0) * Math.PI) / 180);
          } else if (
            elem.kind === 'animated_image' &&
            elem.rotation &&
            typeof elem.rotation === 'object'
          ) {
            ctx.rotate(((elem.rotation.currentAngle ?? 0) * Math.PI) / 180);
          }

          // --- scale ---
          ctx.scale(elem.scale.x, elem.scale.y);

          // --- draw ---
          switch (elem.kind) {
            case 'animated_image': {
              const frame = elem.gifFrames[elem.currentFrame];
              if (frame && frame.imageData instanceof ImageData) {
                ctx.putImageData(frame.imageData, 0, 0);
              } else {
                console.warn(
                  `GIF frame not found or invalid for element ${elem.id}`
                );
              }
              break;
            }

            case 'static_image': {
              if (
                elem.element &&
                elem.element.complete &&
                elem.element.naturalWidth > 0
              ) {
                ctx.drawImage(elem.element, 0, 0);
              }
              break;
            }

            case 'text': {
              // you can draw text here, or in your text overlay renderer
              // Example:
              const fontSize = elem.fontSize ?? 32;
              const fontWeight = elem.fontWeight ?? 'bold';
              const fontFamily = elem.fontFamily ?? 'sans-serif';
              ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
              ctx.fillStyle = elem.color ?? '#000';
              ctx.textAlign = elem.align ?? 'center';
              ctx.textBaseline = elem.baseline ?? 'middle';
              ctx.fillText(elem.text, 0, 0);
              break;
            }
          }

          ctx.restore();
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
    layers: Layer[]
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
