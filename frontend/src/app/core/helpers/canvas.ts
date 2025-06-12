// File: frontend/src/app/core/helpers/canvas.ts

import type { CanvasHelpers, TextLayerElement } from '../../types/index.js';

export const canvasHelpersFactory = (): CanvasHelpers => {
  return {
    get2DContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('2D canvas context is not available!');

      return ctx;
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
      elem: TextLayerElement,
      ctx: CanvasRenderingContext2D
    ): boolean {
      const fontSize = elem.fontSize ?? 32;
      const fontWeight = elem.fontWeight ?? 'bold';
      const fontFamily = elem.fontFamily ?? 'sans-serif';
      ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;

      const width = ctx.measureText(elem.text).width;
      const height = fontSize;

      const handleSize = 10;
      const handleX = elem.position.x + width / 2 - handleSize / 2;
      const handleY = elem.position.y + height / 2 - handleSize / 2;

      return (
        mouse.x >= handleX &&
        mouse.x <= handleX + handleSize &&
        mouse.y >= handleY &&
        mouse.y <= handleY + handleSize
      );
    },

    isPointInText(
      pt: { x: number; y: number },
      elem: TextLayerElement,
      ctx: CanvasRenderingContext2D
    ): boolean {
      ctx.save();

      const fontSize = elem.fontSize ?? 32;
      const fontWeight = elem.fontWeight ?? 'bold';
      const fontFamily = elem.fontFamily ?? 'sans-serif';
      ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;

      const width = ctx.measureText(elem.text).width;
      const height = fontSize;
      ctx.restore();

      return (
        pt.x >= elem.position.x - width / 2 &&
        pt.x <= elem.position.x + width / 2 &&
        pt.y >= elem.position.y - height / 2 &&
        pt.y <= elem.position.y + height / 2
      );
    },

    mapBlendMode(blendMode?: string): GlobalCompositeOperation {
      if (!blendMode || blendMode === 'normal') {
        return 'source-over';
      }

      return blendMode as GlobalCompositeOperation;
    }
  };
};
