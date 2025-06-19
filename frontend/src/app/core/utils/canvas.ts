// File: frontend/src/app/core/utils/canvas.ts

import type {
  CanvasUtils,
  Layer,
  TextLayerElement,
  Typeguards
} from '../../types/index.js';

export const canvasUtilityFactory = (typeguards: Typeguards): CanvasUtils => {
  const utils = {
    drawImagePreserveAspect(
      ctx: CanvasRenderingContext2D,
      img: HTMLImageElement,
      canvasWidth: number,
      canvasHeight: number
    ): void {
      const imgAspect = img.width / img.height;
      const canvasAspect = canvasWidth / canvasHeight;

      let drawWidth, drawHeight, offsetX, offsetY;

      if (imgAspect > canvasAspect) {
        drawWidth = canvasWidth;
        drawHeight = canvasWidth / imgAspect;
        offsetX = 0;
        offsetY = (canvasHeight - drawHeight) / 2;
      } else {
        drawHeight = canvasHeight;
        drawWidth = canvasHeight * imgAspect;
        offsetX = (canvasWidth - drawWidth) / 2;
        offsetY = 0;
      }

      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    },

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
            case 'background': {
              const elem = layer.element;
              if (
                (elem.kind === 'static_image' ||
                  elem.kind === 'animated_image') &&
                elem.element &&
                elem.element.complete &&
                elem.element.naturalWidth > 0
              ) {
                utils.drawImagePreserveAspect(
                  ctx,
                  elem.element,
                  ctx.canvas.width,
                  ctx.canvas.height
                );
              }
              break;
            }

            case 'image':
              const elem = layer.element;
              ctx.save();
              ctx.translate(elem.position.x, elem.position.y);

              let rotation = 0;
              if (elem.kind === 'static_image' || elem.kind === 'text') {
                rotation =
                  typeof elem.rotation === 'number' ? elem.rotation : 0;
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
              } else if (
                elem.kind === 'animated_image' &&
                Array.isArray(elem.gifFrames) &&
                elem.gifFrames.length > 0
              ) {
                const frame = elem.gifFrames[elem.currentFrame];

                if (frame && frame.imageData) {
                  ctx.putImageData(frame.imageData, 0, 0);
                }
              }

              ctx.restore();
              break;

            case 'overlay': {
              const elem = layer.element;

              if (
                (elem.kind === 'static_image' ||
                  elem.kind === 'animated_image') &&
                elem.element &&
                elem.element.complete &&
                elem.element.naturalWidth > 0
              ) {
                utils.drawImagePreserveAspect(
                  ctx,
                  elem.element,
                  ctx.canvas.width,
                  ctx.canvas.height
                );
              }
              break;
            }
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
    },

    prepCanvasHiDPI(ctx: CanvasRenderingContext2D): void {
      const dpr = window.devicePixelRatio || 1;
      // makes coordinates match CSS pixels; keep images sharp
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    },

    resizeCanvasToMatchImage(
      canvas: HTMLCanvasElement,
      img: HTMLImageElement
    ): void {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = img.width * dpr;
      canvas.height = img.height * dpr;
      canvas.style.width = img.width + 'px';
      canvas.style.height = img.height + 'px';
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Canvas 2D context unavailable');
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    },

    setCanvasHiDPISize(
      canvas: HTMLCanvasElement,
      cssWidth: number,
      cssHeight: number
    ): void {
      const dpr = window.devicePixelRatio || 1;

      // set physical bitmap size for HiDPI displays
      canvas.width = cssWidth * dpr;
      canvas.height = cssHeight * dpr;

      // set the CSS size (on-screen size in pixels)
      canvas.style.width = `${cssWidth}px`;
      canvas.style.height = `${cssHeight}px`;
    },

    setCanvasToBackgroundImage(
      canvas: HTMLCanvasElement,
      img: HTMLImageElement,
      maxWidth: number = window.innerWidth,
      maxHeight: number = window.innerHeight
    ): void {
      const dpr = window.devicePixelRatio || 1;
      const imgAspect = img.width / img.height;
      const maxAspect = maxWidth / maxHeight;

      let drawWidth, drawHeight;

      if (imgAspect > maxAspect) {
        drawWidth = Math.min(img.width, maxWidth);
        drawHeight = drawWidth / imgAspect;
      } else {
        drawHeight = Math.min(img.height, maxHeight);
        drawWidth = drawHeight * imgAspect;
      }

      drawWidth = Math.round(drawWidth);
      drawHeight = Math.round(drawHeight);

      canvas.width = drawWidth * dpr;
      canvas.height = drawHeight * dpr;
      canvas.style.width = `${drawWidth}px`;
      canvas.style.height = `${drawHeight}px`;

      // set crisp drawing
      const ctx = canvas.getContext('2d')!;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // draw the background as a 1:1 mapping
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, drawWidth, drawHeight);
    }
  };

  return utils;
};
