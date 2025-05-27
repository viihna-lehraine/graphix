// File: frontend/src/apps/config/math/sets.ts

import type { MathConfig, NumberSets } from '../../types/index.js';

// ================================================== //
// ================================================== //

const float: NumberSets['float'] = {
  min: Number.MIN_SAFE_INTEGER,
  max: Number.MAX_SAFE_INTEGER,
  integer: false,
  exclusiveMin: false,
  exclusiveMax: false
} as const;

/* -------------------------------------------------- */

const integer: NumberSets['integer'] = {
  min: Number.MIN_SAFE_INTEGER,
  max: Number.MAX_SAFE_INTEGER,
  integer: true,
  exclusiveMin: false,
  exclusiveMax: false
} as const;

/* -------------------------------------------------- */

const negativeInteger: NumberSets['negativeInteger'] = {
  min: Number.MIN_SAFE_INTEGER,
  max: -1,
  integer: true,
  exclusiveMin: false,
  exclusiveMax: false
} as const;

/* -------------------------------------------------- */

const negativeNumber: NumberSets['negativeNumber'] = {
  min: -Number.MIN_VALUE,
  max: 0,
  exclusiveMin: false,
  exclusiveMax: true
};

/* -------------------------------------------------- */

const nonNegativeInteger: NumberSets['nonNegativeInteger'] = {
  min: 0,
  max: Number.MAX_SAFE_INTEGER,
  integer: true,
  exclusiveMin: false,
  exclusiveMax: false
} as const;

/* -------------------------------------------------- */

const nonNegativeNumber: NumberSets['nonNegativeNumber'] = {
  min: 0,
  max: Number.MAX_VALUE,
  exclusiveMin: false,
  exclusiveMax: false
};

/* -------------------------------------------------- */

const nonZeroInteger: NumberSets['nonZeroInteger'] = {
  not: 0,
  integer: true
} as const;

/* -------------------------------------------------- */

const nonZeroNumber: NumberSets['nonZeroNumber'] = {
  not: 0
} as const;

/* -------------------------------------------------- */

const percentile: NumberSets['percentile'] = {
  min: 0,
  max: 100,
  exclusiveMin: false,
  exclusiveMax: false
} as const;

/* -------------------------------------------------- */

const positiveInteger: NumberSets['positiveInteger'] = {
  min: 1,
  max: Number.MAX_SAFE_INTEGER,
  integer: true,
  exclusiveMin: false,
  exclusiveMax: false
} as const;

/* -------------------------------------------------- */

const positiveNumber: NumberSets['positiveNumber'] = {
  min: 0,
  max: Number.MAX_VALUE,
  exclusiveMin: false,
  exclusiveMax: true
} as const;

/* -------------------------------------------------- */

const signedPercentile: NumberSets['signedPercentile'] = {
  min: -100,
  max: 100,
  exclusiveMin: false,
  exclusiveMax: false
} as const;

/* -------------------------------------------------- */

const unitInterval: NumberSets['unitInterval'] = {
  min: 0,
  max: 1,
  exclusiveMin: false,
  exclusiveMax: false
} as const;

// ================================================== //
// ================================================== //

export const sets: MathConfig['sets'] = {
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
