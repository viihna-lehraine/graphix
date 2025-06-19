// File: frontend/src/app/core/helpers/canvas.ts

import type {
  CanvasHelpers,
  Engine,
  TextLayerElement
} from '../../types/index.js';
import { StateManager } from '@core/services/state/StateManager.js';

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

    makeAnimationTick(
      engine: Engine,
      stateManager: StateManager
    ): (now: number) => void {
      let lastTimestamp = performance.now();

      function animationTick(now: number): void {
        const deltaTime = (now - lastTimestamp) / 1000;
        lastTimestamp = now;

        const canvasState = stateManager.getCanvas();

        for (const layer of canvasState.layers) {
          if (
            layer.kind === 'image' &&
            layer.element.kind === 'animated_image' &&
            Array.isArray(layer.element.gifFrames) &&
            layer.element.gifFrames.length > 0
          ) {
            const elem = layer.element;
            const frame = elem.gifFrames[elem.currentFrame];

            elem.frameElapsed += deltaTime;

            if (frame && elem.frameElapsed >= frame.delay) {
              elem.currentFrame =
                (elem.currentFrame + 1) % elem.gifFrames.length;
              elem.frameElapsed = 0;
            }
          }
        }

        engine.animationGroupManager.update(deltaTime);
        engine.renderingEngine.render();

        requestAnimationFrame(animationTick);
      }

      return animationTick;
    },

    mapBlendMode(blendMode?: string): GlobalCompositeOperation {
      if (!blendMode || blendMode === 'normal') {
        return 'source-over';
      }

      return blendMode as GlobalCompositeOperation;
    }
  };
};
