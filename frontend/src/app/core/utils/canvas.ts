// File: frontend/src/app/core/utils/canvas.ts

import type {
  CanvasResizeOptions,
  CanvasUtils,
  Services,
  TextElement
} from '../../types/index.js';

// ================================================== //

export const canvasUtilityFactory = (services: Services): CanvasUtils => ({
  autoResize({
    canvas,
    container,
    preserveAspectRatio = true
  }: CanvasResizeOptions): () => void {
    const { errors } = services;

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

  getMousePosition(
    canvas: HTMLCanvasElement,
    evt: MouseEvent
  ): {
    x: number;
    y: number;
  } {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (evt.clientX - rect.left) * scaleX,
      y: (evt.clientY - rect.top) * scaleY
    };
  },

  isOverResizeHandle(
    mouse: { x: number; y: number },
    elem: TextElement,
    ctx: CanvasRenderingContext2D
  ): boolean {
    const fontSize = elem.fontSize ?? 32;
    const fontWeight = elem.fontWeight ?? 'bold';
    const fontFamily = elem.fontFamily ?? 'sans-serif';
    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;

    const width = ctx.measureText(elem.text).width;
    const height = fontSize;

    const handleSize = 10;
    const handleX = elem.x + width / 2 - handleSize / 2;
    const handleY = elem.y + height / 2 - handleSize / 2;

    return (
      mouse.x >= handleX &&
      mouse.x <= handleX + handleSize &&
      mouse.y >= handleY &&
      mouse.y <= handleY + handleSize
    );
  },

  isPointInText(
    pt: { x: number; y: number },
    elem: TextElement,
    ctx: CanvasRenderingContext2D
  ): boolean {
    ctx.save();
    ctx.font = elem.font;
    const width = ctx.measureText(elem.text).width;
    const height = 32;
    ctx.restore();

    return (
      pt.x >= elem.x - width / 2 &&
      pt.x <= elem.x + width / 2 &&
      pt.y >= elem.y - height / 2 &&
      pt.y <= elem.y + height / 2
    );
  }
});
