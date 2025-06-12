// File: frontend/src/app/types/data.ts

import type { Asset, BlendMode } from './index.js';

export interface AssetData {
  dummyTextAsset: Asset;
  exts: AssetExts;
  tags: AssetTags;
}

export interface AssetExts {
  supported: string[];
  unsupported: string[];
}

export type AssetManifest = Asset[];

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
  blendMode: BlendMode;
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
  asset_manifest: '/assets/user/assets.manifest.json';
  gifWorkerScript: '/assets/scripts/gif.worker.js';
}

export interface Regex {
  floatString: RegExp;
  hex: RegExp;
  integerString: RegExp;
  numberString: RegExp;
}

// ================================================== //

export interface Data extends BaseData {
  assets: AssetData;
  config: ConfigData;
  dom: DomData;
  flags: Flags;
  msgs: MessageData;
}
