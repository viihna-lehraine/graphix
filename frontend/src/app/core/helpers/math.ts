// File: frontend/src/app/core/helpers/math.ts

import { MathHelpers } from '../../types/index.js';

export const mathHelpersFactory = (): MathHelpers => ({
  weightedRandom(min: number, max: number, weight: number): number {
    const t = Math.pow(Math.random(), weight);
    return min + t * (max - min);
  }
});
