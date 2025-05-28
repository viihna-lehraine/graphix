// File: frontend/src/app/data/math/sets.ts

import type { MathData, Sets } from '../../types/index.js';

// ================================================== //
// ================================================== //

const float: Sets['float'] = {
  min: Number.MIN_SAFE_INTEGER,
  max: Number.MAX_SAFE_INTEGER,
  integer: false,
  exclusiveMin: false,
  exclusiveMax: false
} as const;

/* -------------------------------------------------- */

const integer: Sets['integer'] = {
  min: Number.MIN_SAFE_INTEGER,
  max: Number.MAX_SAFE_INTEGER,
  integer: true,
  exclusiveMin: false,
  exclusiveMax: false
} as const;

/* -------------------------------------------------- */

const negativeInteger: Sets['negativeInteger'] = {
  min: Number.MIN_SAFE_INTEGER,
  max: -1,
  integer: true,
  exclusiveMin: false,
  exclusiveMax: false
} as const;

/* -------------------------------------------------- */

const negativeNumber: Sets['negativeNumber'] = {
  min: -Number.MIN_VALUE,
  max: 0,
  exclusiveMin: false,
  exclusiveMax: true
};

/* -------------------------------------------------- */

const nonNegativeInteger: Sets['nonNegativeInteger'] = {
  min: 0,
  max: Number.MAX_SAFE_INTEGER,
  integer: true,
  exclusiveMin: false,
  exclusiveMax: false
} as const;

/* -------------------------------------------------- */

const nonNegativeNumber: Sets['nonNegativeNumber'] = {
  min: 0,
  max: Number.MAX_VALUE,
  exclusiveMin: false,
  exclusiveMax: false
};

/* -------------------------------------------------- */

const nonZeroInteger: Sets['nonZeroInteger'] = {
  not: 0,
  integer: true
} as const;

/* -------------------------------------------------- */

const nonZeroNumber: Sets['nonZeroNumber'] = {
  not: 0
} as const;

/* -------------------------------------------------- */

const percentile: Sets['percentile'] = {
  min: 0,
  max: 100,
  exclusiveMin: false,
  exclusiveMax: false
} as const;

/* -------------------------------------------------- */

const positiveInteger: Sets['positiveInteger'] = {
  min: 1,
  max: Number.MAX_SAFE_INTEGER,
  integer: true,
  exclusiveMin: false,
  exclusiveMax: false
} as const;

/* -------------------------------------------------- */

const positiveNumber: Sets['positiveNumber'] = {
  min: 0,
  max: Number.MAX_VALUE,
  exclusiveMin: false,
  exclusiveMax: true
} as const;

/* -------------------------------------------------- */

const signedPercentile: Sets['signedPercentile'] = {
  min: -100,
  max: 100,
  exclusiveMin: false,
  exclusiveMax: false
} as const;

/* -------------------------------------------------- */

const unitInterval: Sets['unitInterval'] = {
  min: 0,
  max: 1,
  exclusiveMin: false,
  exclusiveMax: false
} as const;

// ================================================== //
// ================================================== //

export const sets: MathData['sets'] = {
  float,
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
