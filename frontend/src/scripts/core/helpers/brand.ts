// File: frontend/src/scripts/core/helpers/brand.ts

import type {
  BrandHelpers,
  Float,
  Integer,
  NonNegativeInteger,
  NonNegativeNumber,
  NonZeroInteger,
  NonZeroNumber,
  Percentile,
  PositiveInteger,
  PositiveNumber,
  SignedPercentile,
  UnitInterval
} from '../../types/index.js';

// ================================================== //
// ================================================== //

export const brandFactory = (): BrandHelpers => ({
  asBrandedFromString<T>(str: string, check: (n: number) => boolean, brand: (n: number) => T): T {
    const n = Number(str);
    if (!check(n)) throw new Error(`String '${str}' does not match branded type.`);
    return brand(n);
  },

  /* -------------------------------------------------- */

  asFloat(x: number): Float {
    if (!Number.isFinite(x) || Number.isInteger(x)) throw new Error(`Value ${x} is not a float`);
    return x as Float;
  },

  /* -------------------------------------------------- */

  asInteger(x: number): Integer {
    if (!Number.isInteger(x)) throw new Error(`Value ${x} is not an integer.`);
    return x as Integer;
  },

  /* -------------------------------------------------- */

  asNonNegativeInteger(x: number): NonNegativeInteger {
    if (!Number.isInteger(x) || x < 0) throw new Error(`Value ${x} is not a non-negative integer`);
    return x as NonNegativeInteger;
  },

  /* -------------------------------------------------- */

  asNonNegativeNumber(x: number): NonNegativeNumber {
    if (x < 0) throw new Error(`Value ${x} is not a non-negative number`);
    return x as NonNegativeNumber;
  },

  /* -------------------------------------------------- */

  asNonZeroInteger(x: number): NonZeroInteger {
    if (!Number.isInteger(x) || x === 0) throw new Error(`Value ${x} is not a non-zero integer`);
    return x as NonZeroInteger;
  },

  /* -------------------------------------------------- */

  asNonZeroNumber(x: number): NonZeroNumber {
    if (x === 0) throw new Error(`Value ${x} is not a non-zero number`);
    return x as NonZeroNumber;
  },

  /* -------------------------------------------------- */

  asPercentile(x: number): Percentile {
    if (!(x >= 0 && x <= 100)) throw new Error(`Value ${x} is not a valid percentile`);
    return x as Percentile;
  },

  /* -------------------------------------------------- */

  asPositiveInteger(x: number): PositiveInteger {
    if (!Number.isInteger(x) || x <= 0) throw new Error(`Value ${x} is not a positive integer`);
    return x as PositiveInteger;
  },

  /* -------------------------------------------------- */

  asPositiveNumber(x: number): PositiveNumber {
    if (!(x > 0)) throw new Error(`Value ${x} is not a positive number`);
    return x as PositiveNumber;
  },

  /* -------------------------------------------------- */

  asSignedPercentile(x: number): SignedPercentile {
    if (!(x >= -100 && x <= 100)) throw new Error(`Value ${x} is not a valid signed percentile`);
    return x as SignedPercentile;
  },

  /* -------------------------------------------------- */

  asUnitInterval(x: number): UnitInterval {
    if (!(x >= 0 && x <= 1)) throw new Error(`Value ${x} is not a unit interval value`);
    return x as UnitInterval;
  }
});
