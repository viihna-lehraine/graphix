// File: frontend/src/app/core/helpers/canvas.ts

import type { CanvasHelpers } from '../../types/index.js';

export const canvasHelpersFactory = (): CanvasHelpers => {
  return {
    mapBlendMode(blendMode?: string): GlobalCompositeOperation {
      if (!blendMode || blendMode === 'normal') {
        return 'source-over';
      }

      return blendMode as GlobalCompositeOperation;
    }
  };
};
