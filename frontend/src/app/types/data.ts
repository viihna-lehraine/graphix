// File: frontend/src/app/types/data.ts

import type { Sets } from './index.js';

// ================================================== //
// ================================================== //

export interface DefaultData {
  fileName: string;
}

/* -------------------------------------------------- */

export interface DOMElements {
  canvas: HTMLCanvasElement | null;
}

/* -------------------------------------------------- */

export interface ErrorMessages {
  unknownFatalError: string;
}

/* -------------------------------------------------- */

export interface RegexData {
  floatString: RegExp;
  integerString: RegExp;
  numberString: RegExp;
}

// ================================================== //
// ================================================== //

export interface ConfigurationData {
  default: DefaultData;
  regex: RegexData;
}

/* -------------------------------------------------- */

export interface DOMData {
  elements: DOMElements;
}

/* -------------------------------------------------- */

export interface MathData {
  sets: Sets;
}

/* -------------------------------------------------- */

export interface MessageData {
  errors: ErrorMessages;
}

// ================================================== //
// ================================================== //

export interface Data {
  config: ConfigurationData;
  dom: DOMData;
  math: MathData;
  msgs: MessageData;
}
