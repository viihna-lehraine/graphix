// File: frontend/src/app/data/math/sets.ts

import type { MathData, Sets } from '../../types/index.js';
import { regexData } from '../config/regex.js';

// ================================================== //
// ================================================== //

const float: Sets['float'] = {
  min: Number.MIN_SAFE_INTEGER,
  max: Number.MAX_SAFE_INTEGER,
  integer: false,
  exclusiveMin: false,
  exclusiveMax: false,
  description: 'All floating-point numbers'
} as const;

/* -------------------------------------------------- */

const hex: Sets['hex'] = {
  regex: regexData.hex,
  lengths: [3, 4, 6, 8],
  description: 'CSS hex color (#RGB, #RGBA, #RRGGBB, #RRGGBBAA)',
  caseInsensitive: true,
  prefix: '#'
} as const;

/* -------------------------------------------------- */

const integer: Sets['integer'] = {
  min: Number.MIN_SAFE_INTEGER,
  max: Number.MAX_SAFE_INTEGER,
  integer: true,
  exclusiveMin: false,
  exclusiveMax: false,
  description: 'All integers'
} as const;

/* -------------------------------------------------- */

const negativeInteger: Sets['negativeInteger'] = {
  min: Number.MIN_SAFE_INTEGER,
  max: -1,
  integer: true,
  exclusiveMin: false,
  exclusiveMax: false,
  description: 'All negative integers'
} as const;

/* -------------------------------------------------- */

const negativeNumber: Sets['negativeNumber'] = {
  min: -Number.MIN_VALUE,
  max: 0,
  exclusiveMin: false,
  exclusiveMax: true,
  description: 'All negative numbers'
};

/* -------------------------------------------------- */

const nonNegativeInteger: Sets['nonNegativeInteger'] = {
  min: 0,
  max: Number.MAX_SAFE_INTEGER,
  integer: true,
  exclusiveMin: false,
  exclusiveMax: false,
  description: 'All non-negative integers (0 and positive integers)'
} as const;

/* -------------------------------------------------- */

const nonNegativeNumber: Sets['nonNegativeNumber'] = {
  min: 0,
  max: Number.MAX_VALUE,
  exclusiveMin: false,
  exclusiveMax: false,
  description: 'All non-negative numbers (0 and positive numbers)'
};

/* -------------------------------------------------- */

const nonZeroInteger: Sets['nonZeroInteger'] = {
  not: 0,
  integer: true,
  description: 'All integers except zero'
} as const;

/* -------------------------------------------------- */

const nonZeroNumber: Sets['nonZeroNumber'] = {
  not: 0,
  description: 'All numbers except zero'
} as const;

/* -------------------------------------------------- */

const percentile: Sets['percentile'] = {
  min: 0,
  max: 100,
  exclusiveMin: false,
  exclusiveMax: false,
  description: 'All percentiles (0 to 100)'
} as const;

/* -------------------------------------------------- */

const positiveInteger: Sets['positiveInteger'] = {
  min: 1,
  max: Number.MAX_SAFE_INTEGER,
  integer: true,
  exclusiveMin: false,
  exclusiveMax: false,
  description: 'All positive integers (1 and above)'
} as const;

/* -------------------------------------------------- */

const positiveNumber: Sets['positiveNumber'] = {
  min: 0,
  max: Number.MAX_VALUE,
  exclusiveMin: false,
  exclusiveMax: true,
  description: 'All positive numbers (greater than 0)'
} as const;

/* -------------------------------------------------- */

const signedPercentile: Sets['signedPercentile'] = {
  min: -100,
  max: 100,
  exclusiveMin: false,
  exclusiveMax: false,
  description: 'All signed percentiles (-100 to 100, inclusive)'
} as const;

/* -------------------------------------------------- */

const unitInterval: Sets['unitInterval'] = {
  min: 0,
  max: 1,
  exclusiveMin: false,
  exclusiveMax: false,
  description: 'All numbers in the unit interval [0, 1] (inclusive)'
} as const;

// ================================================== //
// ================================================== //

export const sets: MathData['sets'] = {
  float,
  hex,
  integer,
  negativeInteger,
  negativeNumber,
  nonNegativeInteger,
  nonNegativeNumber,
  nonZeroInteger,
  nonZeroNumber,
  percentile,
  positiveInteger,
  positiveNumber,
  signedPercentile,
  unitInterval
} as const;
