// File: frontend/src/app/types/data.ts

import type { Sets } from './index.js';

// ================================================== //
// ================================================== //

export type AllowedExtensions = string[];

/* -------------------------------------------------- */

export type BaseAssetTags = string[];

/* -------------------------------------------------- */

export interface DefaultData {
  fileName: string;
}

/* -------------------------------------------------- */

export interface DOMData {
  elements: DOMElements;
  ids: DOM_IDs;
}

/* -------------------------------------------------- */

export interface DOMElements {
  canvas: HTMLCanvasElement | null;
}

/* -------------------------------------------------- */

export interface DOM_IDs {
  btns: {
    clear: string;
    download: string;
    upload: string;
  };
  divs: {
    canvasContainer: string;
    canvasToolbar: string;
  };
  inputs: {
    imgUpload: string;
  };
  canvas: string;
}

/* -------------------------------------------------- */

export interface ErrorMessages {
  unknownFatalError: string;
}

/* -------------------------------------------------- */

export interface ExtensionData {
  allowed: AllowedExtensions;
}

/* -------------------------------------------------- */

export interface RegexData {
  floatString: RegExp;
  integerString: RegExp;
  numberString: RegExp;
}

/* -------------------------------------------------- */

export interface AssetTagsData {
  base: BaseAssetTags;
}

// ================================================== //
// ================================================== //

export interface AssetData {
  ext: ExtensionData;
  tags: AssetTagsData;
}

/* -------------------------------------------------- */

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
  assets: AssetData;
  config: ConfigurationData;
  dom: DOMData;
  math: MathData;
  msgs: MessageData;
}
