// File: frontend/src/app/types/data.ts

import type { Hex, Sets } from './index.js';

// ================================================== //

export type BaseAssetTags = string[];

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
  animation: {
    frameCount: number;
  };
  canvasWidth: number;
  canvasHeight: number;
  debounceWait: number;
  fileName: string;
  font: string;
  textAlignment: CanvasTextAlign;
  textBaseline: CanvasTextBaseline;
  textColor: Hex;
  textElement: {
    font: string;
    color: Hex;
    align: CanvasTextAlign;
    baseline: CanvasTextBaseline;
  };
}

export type DomClasses = Record<string, string>;

export interface DomData {
  classes: DomClasses;
  ids: DomIds;
}

export interface DomIds {
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
  supported: SupportedExts;
  unsupported: UnsupportedExts;
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

export type SupportedExt = 'jpeg' | 'jpg' | 'png';

export type SupportedExts = Readonly<SupportedExt[]>;

export type UnsupportedExt = 'gif' | 'svg' | 'webp';

export type UnsupportedExts = Readonly<UnsupportedExt[]>;

// ================================================== //

export interface Data {
  assets: AssetData;
  config: ConfigurationData;
  dom: DomData;
  math: MathData;
  msgs: MessageData;
}
