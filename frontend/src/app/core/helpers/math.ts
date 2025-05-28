// File: frontend/src/app/core/helpers/math.ts

import { Helpers } from '../../types/index.js';

// =================================================== //
// =================================================== //

export const mathHelpersFactory = (): Helpers['math'] => ({
  weightedRandom(min: number, max: number, weight: number): number {
    const t = Math.pow(Math.random(), weight);
    return min + t * (max - min);
  }
});
