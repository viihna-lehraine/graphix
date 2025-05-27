// File: frontend/src/scripts/config/data/regex.ts

import type { RegexData } from '../../types/index.js';

// ================================================= //
// ================================================= //

const floatString: RegExp = /^[-+]?\d*\.\d+(e[-+]?\d+)?$/i;
const integerString: RegExp = /^[-+]?\d+$/i;
const numberString: RegExp = /^[-+]?\d*\.?\d+(e[-+]?\d+)?$/i;

// ================================================= //
// ================================================= //

export const regexData: RegexData = {
  floatString,
  integerString,
  numberString
} as const;
