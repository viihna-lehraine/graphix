// File: frontend/src/scripts/types/sets.ts

export type Float = number & { _brand: 'float' };

/* ------------------------------------------------- */

export type Integer = number & { _brand: 'integer' };

/* ------------------------------------------------- */

export type NonNegativeInteger = number & { _brand: 'nonNegativeInteger' };

/* ------------------------------------------------- */

export type NonNegativeNumber = number & { _brand: 'nonNegativeNumber' };

/* ------------------------------------------------- */

export type NonZeroInteger = number & { _brand: 'nonZeroInteger' };

/* ------------------------------------------------- */

export type NonZeroNumber = number & { _brand: 'nonZeroNumber' };

/* ------------------------------------------------- */

export type Percentile = number & { _brand: 'percentile' };

/* ------------------------------------------------- */

export type PositiveInteger = number & { _brand: 'positiveInteger' };

/* ------------------------------------------------- */

export type PositiveNumber = number & { _brand: 'positiveNumber' };

/* ------------------------------------------------- */

export type SignedPercentile = number & { _brand: 'signedPercentile' };

/* ------------------------------------------------- */

export type UnitInterval = number & { _brand: 'unitInterval' };

// ================================================== //
// ================================================== //

export interface NumberSets {
  float: {
    min: number;
    max: number;
    integer: boolean;
    exclusiveMin: boolean;
    exclusiveMax: boolean;
  };
  integer: {
    min: number;
    max: number;
    integer: boolean;
    exclusiveMin: boolean;
    exclusiveMax: boolean;
  };
  negativeInteger: {
    min: number;
    max: number;
    integer: boolean;
    exclusiveMin: boolean;
    exclusiveMax: boolean;
  };
  negativeNumber: {
    min: number;
    max: number;
    exclusiveMin: boolean;
    exclusiveMax: boolean;
  };
  nonNegativeInteger: {
    min: number;
    max: number;
    integer: boolean;
    exclusiveMin: boolean;
    exclusiveMax: boolean;
  };
  nonNegativeNumber: {
    min: number;
    max: number;
    exclusiveMin: boolean;
    exclusiveMax: boolean;
  };
  nonZeroInteger: {
    not: number;
    integer: boolean;
  };
  nonZeroNumber: {
    not: number;
  };
  percentile: {
    min: number;
    max: number;
    exclusiveMin: boolean;
    exclusiveMax: boolean;
  };
  positiveInteger: {
    min: number;
    max: number;
    integer: boolean;
    exclusiveMin: boolean;
    exclusiveMax: boolean;
  };
  positiveNumber: {
    min: number;
    max: number;
    exclusiveMin: boolean;
    exclusiveMax: boolean;
  };
  signedPercentile: {
    min: number;
    max: number;
    exclusiveMin: boolean;
    exclusiveMax: boolean;
  };
  unitInterval: {
    min: number;
    max: number;
    exclusiveMin: boolean;
    exclusiveMax: boolean;
  };
}
