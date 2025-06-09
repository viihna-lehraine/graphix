// File: frontend/src/app/core/utils/canvas.ts

import type {
  CanvasRefs,
  CanvasResizeOptions,
  CanvasState,
  CanvasUtils,
  Data,
  Helpers,
  Services,
  TextVisualLayer,
  VisualLayer
} from '../../types/index.js';

// ================================================== //

export const canvasUtilityFactory = (
  data: Data,
  helpers: Helpers,
  services: Services
): CanvasUtils => {
  const canvasHelpers = helpers.canvas;
  const { errors } = services;

  function clearCanvas(ctx: CanvasRenderingContext2D): void {
    return errors.handleSync(() => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }, 'Unhandled canvas clear error.');
  }

  function drawBoundary(ctx: CanvasRenderingContext2D): void {
    return errors.handleSync(() => {
      ctx.save();
      ctx.lineWidth = 8;
      ctx.strokeStyle = '#ff80c5ff';
      ctx.setLineDash([12, 10]);
      ctx.strokeRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.restore();
    }, 'Unhandled canvas boundary drawing error.');
  }

  function drawTextAndSelection(
    ctx: CanvasRenderingContext2D,
    layers: VisualLayer[],
    selectedLayerIndex: number | null
  ): void {
    return errors.handleSync(() => {
      const textLayer = layers.find(
        (l): l is TextVisualLayer => l.type === 'text'
      );

      if (!textLayer) return;

      for (const elem of textLayer.textElements!) {
        ctx.save();
        const fontSize = elem.fontSize ?? 32;
        const fontWeight = elem.fontWeight ?? 'bold';
        const fontFamily = elem.fontFamily ?? 'sans-serif';
        ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
        ctx.fillStyle = elem.color;
        ctx.textAlign = elem.align;
        ctx.textBaseline = elem.baseline;
        ctx.fillText(elem.text, elem.x, elem.y);
        ctx.restore();
      }

      if (selectedLayerIndex !== null) {
        const selectedLayer = layers[selectedLayerIndex];
        if (selectedLayer?.type === 'text') {
          ctx.save();
          ctx.strokeStyle = '#00F6';
          ctx.lineWidth = 2;
          ctx.setLineDash([4, 2]);
          ctx.strokeRect(0, 0, ctx.canvas.width, ctx.canvas.height);
          ctx.restore();
        }
      }
    }, 'Unhandled canvas text and selection drawing error.');
  }

  function drawVisualLayers(
    ctx: CanvasRenderingContext2D,
    layers: VisualLayer[]
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
            if (frame) {
              ctx.putImageData(frame.imageData, 0, 0);
            }
            break;
          }

          case 'image': {
            ctx.drawImage(layer.element, 0, 0);
            break;
          }

          case 'overlay': {
            ctx.globalCompositeOperation = canvasHelpers.mapBlendMode(
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

  return {
    clearCanvas,
    drawBoundary,
    drawTextAndSelection,
    drawVisualLayers,

    autoResize({
      canvas,
      container,
      preserveAspectRatio = true
    }: CanvasResizeOptions): () => void {
      return errors.handleSync(() => {
        const resize = () => {
          const rect = container.getBoundingClientRect();

          if (preserveAspectRatio) {
            const aspect = canvas.width / canvas.height || 4 / 3;
            let width = rect.width;
            let height = rect.width / aspect;

            if (height > rect.height) {
              height = rect.height;
              width = rect.height * aspect;
            }

            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
          } else {
            canvas.style.width = `${rect.width}px`;
            canvas.style.height = `${rect.height}px`;
          }
        };

        resize(); // initial resize call

        window.addEventListener('resize', resize);

        return () => window.removeEventListener('resize', resize);
      }, 'Unhandled canvas auto-resize error.');
    },

    getCanvasElement(): HTMLCanvasElement {
      return errors.handleSync(() => {
        const canvas = document.getElementById(
          data.dom.ids.canvas
        ) as HTMLCanvasElement | null;
        if (!canvas) throw new Error('Main canvas element not found!');

        return canvas;
      }, 'Unhandled canvas retrieval error.');
    },

    getRefs(): CanvasRefs {
      return errors.handleSync(() => {
        const canvas = document.getElementById(
          data.dom.ids.canvas
        ) as HTMLCanvasElement | null;
        if (!canvas) throw new Error('Canvas element not found!');

        const ctx = canvas.getContext('2d');

        if (!ctx)
          throw new Error(
            `2D context not supported or the canvas is not available/initialized!`
          );

        return { canvas, ctx };
      }, 'Unhandled canvas reference retrieval error.');
    },

    redraw(ctx: CanvasRenderingContext2D, state: CanvasState): void {
      return errors.handleSync(() => {
        clearCanvas(ctx);
        drawBoundary(ctx);

        drawVisualLayers(ctx, state.layers);

        drawTextAndSelection(ctx, state.layers, state.selectedLayerIndex);
      }, 'Unhandled canvas redraw error.');
    },

    resizeCanvasToParent(): void {
      return errors.handleSync(() => {
        const canvas = document.getElementById(
          data.dom.ids.canvas
        ) as HTMLCanvasElement | null;
        if (!canvas) throw new Error('Canvas element not found!');
        const parent = canvas.parentElement;
        if (!parent) throw new Error('Canvas has no parent element!');

        const rect = parent.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;

        // set actual bitmap size
        canvas.width = Math.round(rect.width * dpr);
        canvas.height = Math.round(rect.height * dpr);

        // set display size
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;
      }, 'Unhandled canvas resize error.');
    }
  };
};
