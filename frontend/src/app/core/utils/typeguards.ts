// File: frontend/src/app/core/utils/typeguards.ts

import type { ImageLayer, Layer, Typeguards } from '../../types/index.js';

export const typeguardFactory = (): Typeguards => ({
  isImageLayer(layer: Layer): layer is ImageLayer {
    return layer.kind === 'image';
  }
});
