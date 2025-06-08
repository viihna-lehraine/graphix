// File: frontend/src/app/config/data/regex.ts

import type { RegexData } from '../../types/index.js';

// ================================================= //
// ================================================= //

const floatString: RegExp = /^[-+]?\d*\.\d+(e[-+]?\d+)?$/i;
const hex: RegExp = /^#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;
const integerString: RegExp = /^[-+]?\d+$/i;
const numberString: RegExp = /^[-+]?\d*\.?\d+(e[-+]?\d+)?$/i;

// ================================================= //
// ================================================= //

export const regexData: RegexData = {
  floatString,
  hex,
  integerString,
  numberString
} as const;
