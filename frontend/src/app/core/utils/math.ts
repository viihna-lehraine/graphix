// File: frontend/src/app/core/utils/math.ts

import type { MathUtils } from '../../types/index.js';

export const mathUtilityFactory = (): MathUtils => ({
  modulo(x: number, n: number): number {
    return ((x % n) + n) % n;
  },

  roundToStep(x: number, step: number): number {
    return Math.round(x / step) * step;
  },

  toDegrees(rad: number): number {
    return rad * (180 / Math.PI);
  },

  toRadians(deg: number): number {
    return deg * (Math.PI / 180);
  }
});
