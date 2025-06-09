// File: frontend/src/app/types/sets.ts

export type Float = number & { _brand: 'float' };

export type Hex = string & { _brand: 'hex' };

export type Integer = number & { _brand: 'integer' };

export type NonNegativeInteger = number & { _brand: 'nonNegativeInteger' };

export type NonNegativeNumber = number & { _brand: 'nonNegativeNumber' };

export type NonZeroInteger = number & { _brand: 'nonZeroInteger' };

export type NonZeroNumber = number & { _brand: 'nonZeroNumber' };

export type Percentile = number & { _brand: 'percentile' };

export type PositiveInteger = number & { _brand: 'positiveInteger' };

export type PositiveNumber = number & { _brand: 'positiveNumber' };

export type SignedPercentile = number & { _brand: 'signedPercentile' };

export type UnitInterval = number & { _brand: 'unitInterval' };

// ================================================== //

export interface Sets {
  hex: {
    regex: RegExp;
    lengths: number[]; // [3,4,6,8]
    description: string;
    caseInsensitive: boolean;
    prefix: string; // '#'
  };
  float: {
    min: number;
    max: number;
    integer: boolean;
    exclusiveMin: boolean;
    exclusiveMax: boolean;
    description: string;
  };
  integer: {
    min: number;
    max: number;
    integer: boolean;
    exclusiveMin: boolean;
    exclusiveMax: boolean;
    description: string;
  };
  negativeInteger: {
    min: number;
    max: number;
    integer: boolean;
    exclusiveMin: boolean;
    exclusiveMax: boolean;
    description: string;
  };
  negativeNumber: {
    min: number;
    max: number;
    exclusiveMin: boolean;
    exclusiveMax: boolean;
    description: string;
  };
  nonNegativeInteger: {
    min: number;
    max: number;
    integer: boolean;
    exclusiveMin: boolean;
    exclusiveMax: boolean;
    description: string;
  };
  nonNegativeNumber: {
    min: number;
    max: number;
    exclusiveMin: boolean;
    exclusiveMax: boolean;
    description: string;
  };
  nonZeroInteger: {
    not: number;
    integer: boolean;
    description: string;
  };
  nonZeroNumber: {
    not: number;
    description: string;
  };
  percentile: {
    min: number;
    max: number;
    exclusiveMin: boolean;
    exclusiveMax: boolean;
    description: string;
  };
  positiveInteger: {
    min: number;
    max: number;
    integer: boolean;
    exclusiveMin: boolean;
    exclusiveMax: boolean;
    description: string;
  };
  positiveNumber: {
    min: number;
    max: number;
    exclusiveMin: boolean;
    exclusiveMax: boolean;
    description: string;
  };
  signedPercentile: {
    min: number;
    max: number;
    exclusiveMin: boolean;
    exclusiveMax: boolean;
    description: string;
  };
  unitInterval: {
    min: number;
    max: number;
    exclusiveMin: boolean;
    exclusiveMax: boolean;
    description: string;
  };
}
