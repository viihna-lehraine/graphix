// File: frontend/src/app/types/data.ts

import type { AssetClass } from './index.js';

export interface AssetData {
  exts: AssetExts;
  tags: AssetTags;
}

export interface AssetExts {
  supported: SupportedExts;
  unsupported: UnsupportedExts;
}

export type AssetManifest = {
  name: string;
  class: AssetClass;
  ext: string;
  type: string;
  src: string;
}[];

export type AssetTags = string[];

export interface BaseData {
  version: string;
}

export interface ConfigData {
  defaults: Defaults;
  paths: Paths;
  regex: Regex;
}

export interface Defaults {
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
  textColor: string;
  textElement: {
    font: string;
    color: string;
    align: CanvasTextAlign;
    baseline: CanvasTextBaseline;
  };
}

export interface DomDivIds {
  assetBrowserDiv: string;
  canvasContainerDiv: string;
  canvasToolbarDiv: string;
}

export interface DomBtnIds {
  clearBtn: string;
  downloadBtn: string;
  toggleAssetBrowserBtn: string;
  uploadBtn: string;
}

export type DomClasses = Record<string, string>;

export interface DomData {
  classes: DomClasses;
  ids: DomIds;
}

export interface DomFormIds {
  textForm: string;
}

export type DomIds = DomBtnIds &
  DomDivIds &
  DomFormIds &
  DomInputIds & {
    canvas: string;
  };

export interface DomInputIds {
  imgUploadInput: string;
  textInput: string;
}

export interface ErrorMessages {
  unknownFatalError: string;
}

export interface Flags {
  devMode: boolean;
}

export interface Manifests {
  asset: AssetManifest;
}

export interface MessageData {
  errors: ErrorMessages;
}

export interface Paths {
  gifWorkerScript: '/assets/scripts/gif.worker.js';
}

export interface Regex {
  floatString: RegExp;
  hex: RegExp;
  integerString: RegExp;
  numberString: RegExp;
}

export type SupportedExt = 'gif' | 'jpeg' | 'jpg' | 'png' | 'webp';

export type SupportedExts = Readonly<SupportedExt[]>;

export type UnsupportedExt = 'svg';

export type UnsupportedExts = Readonly<UnsupportedExt[]>;

// ================================================== //

export interface Data extends BaseData {
  assets: AssetData;
  config: ConfigData;
  dom: DomData;
  flags: Flags;
  msgs: MessageData;
}
