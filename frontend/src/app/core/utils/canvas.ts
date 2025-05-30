// File: frontend/src/app/core/utils/canvas.ts

import type {
  CanvasResizeOptions,
  CanvasUtils,
  Services
} from '../../types/index.js';

// ================================================== //
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
  }
});
