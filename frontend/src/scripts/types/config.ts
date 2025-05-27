// File: frontend/src/scripts/types/config.ts

import type { NumberSets } from './index.js';

// ================================================== //
// ================================================== //

export interface AppData {}

/* -------------------------------------------------- */

export interface DefaultData {
  fileName: string;
}

/* -------------------------------------------------- */

export interface DOMData {
  canvas: HTMLCanvasElement;
  counter: HTMLSpanElement;
  form: HTMLFormElement;
  input: HTMLInputElement;
  list: HTMLUListElement;
}

/* -------------------------------------------------- */

export interface RegexData {
  floatString: RegExp;
  integerString: RegExp;
  numberString: RegExp;
}

// ================================================== //
// ================================================== //

export interface Data {
  default: DefaultData;
  dom: DOMData;
  regex: RegexData;
}

/* -------------------------------------------------- */

export interface MathConfig {
  sets: NumberSets;
}

// ================================================== //
// ================================================== //

export interface Configuration {
  data: Data;
  math: MathConfig;
}
