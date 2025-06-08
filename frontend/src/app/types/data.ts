// File: frontend/src/app/types/data.ts

import type { Hex, Sets } from './index.js';

// ================================================== //

export type AllowedExtensions = string[];

export type BaseAssetTags = string[];

// ================================================== //

export interface AssetData {
  ext: ExtensionData;
  tags: AssetTagsData;
}

export interface AssetTagsData {
  base: BaseAssetTags;
}

export interface ConfigurationData {
  default: DefaultData;
  regex: RegexData;
}

export interface DefaultData {
  canvasWidth: number;
  canvasHeight: number;
  debounceWait: number;
  fileName: string;
  textElement: {
    font: string;
    color: Hex;
    align: CanvasTextAlign;
    baseline: CanvasTextBaseline;
  };
}

export type DOM_Classes = Record<string, string>;

export interface DOMData {
  classes: DOM_Classes;
  ids: DOM_IDs;
}

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
  forms: {
    text: string;
  };
  inputs: {
    imgUpload: string;
    text: string;
  };
  canvas: string;
}

export interface ErrorMessages {
  unknownFatalError: string;
}

export interface ExtensionData {
  allowed: AllowedExtensions;
}

export interface MathData {
  sets: Sets;
}

export interface MessageData {
  errors: ErrorMessages;
}

export interface RegexData {
  floatString: RegExp;
  hex: RegExp;
  integerString: RegExp;
  numberString: RegExp;
}

// ================================================== //

export interface Data {
  assets: AssetData;
  config: ConfigurationData;
  dom: DOMData;
  math: MathData;
  msgs: MessageData;
}
