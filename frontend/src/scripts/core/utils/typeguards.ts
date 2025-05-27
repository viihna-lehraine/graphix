// File: frontend/src/scripts/core/helpers/typeGuards.ts

import type {
  Float,
  Integer,
  NonNegativeInteger,
  NonNegativeNumber,
  NonZeroInteger,
  NonZeroNumber,
  Percentile,
  PositiveInteger,
  PositiveNumber,
  RegexData,
  SignedPercentile,
  UnitInterval,
  Utilities
} from '../../types/index.js';

// ================================================== //
// ================================================== //

export const typeguardFactory = (regex: RegexData): Utilities['typeguards'] => ({
  isFloat(value: number): value is Float {
    return Number.isFinite(value) && !Number.isInteger(value);
  },

  isFloatString(str: string): boolean {
    const s = str.trim();
    return !regex.integerString.test(s.trim()) && regex.numberString.test(s);
  },

  isInteger(value: number): value is Integer {
    return Number.isInteger(value);
  },

  isIntegerString(str: string): boolean {
    const s = str.trim();
    return regex.integerString.test(s);
  },

  isNonNegativeInteger(value: number): value is NonNegativeInteger {
    return Number.isInteger(value) && value >= 0;
  },

  isNonNegativeNumber(value: number): value is NonNegativeNumber {
    return Number.isFinite(value) && value >= 0;
  },

  isNonZeroInteger(value: number): value is NonZeroInteger {
    return Number.isInteger(value) && value !== 0;
  },

  isNonZeroNumber(value: number): value is NonZeroNumber {
    return Number.isFinite(value) && value !== 0;
  },

  isPercentile(value: number): value is Percentile {
    return Number.isFinite(value) && value >= 0 && value <= 100;
  },

  isPositiveInteger(value: number): value is PositiveInteger {
    return Number.isInteger(value) && value > 0;
  },

  isPositiveNumber(value: number): value is PositiveNumber {
    return Number.isFinite(value) && value > 0;
  },

  isSignedPercentile(value: number): value is SignedPercentile {
    return Number.isFinite(value) && value >= -100 && value <= 100;
  },

  isUnitInterval(value: number): value is UnitInterval {
    return Number.isFinite(value) && value >= 0 && value <= 1;
  },

  parseNumberString(str: string): Float | Integer | undefined {
    const s = str.trim();

    if (regex.integerString.test(s)) return Number(s) as Integer;
    if (regex.floatString.test(s)) return Number(str) as Float;

    return undefined;
  }
});
