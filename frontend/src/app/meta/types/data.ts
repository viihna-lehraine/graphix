// File: frontend/src/app/meta/types/data.ts

import type { Asset, BlendMode } from '../index.js';

export interface AssetData {
  dummyTextAsset: Asset;
  exts: AssetExtensions;
  tags: AssetTags;
}

export interface AssetExtensions {
  supported: string[];
  unsupported: string[];
}

export type AssetManifest = { assets: Asset[] };

export type AssetTags = string[];

export interface Defaults {
  animation: {
    frameCount: number;
  };
  blendMode: BlendMode;
  boundaryStrokeStyle: string;
  canvasWidth: number;
  canvasHeight: number;
  debounceWait: number;
  delayMs: number;
  fileExt: string;
  fileName: string;
  font: string;
  lineDash: [number, number];
  retryAttempts: number;
  retryDelayMs: number;
  suppressAlert: boolean;
  suppressConsole: boolean;
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
  addImgBtn: string;
  clearBtn: string;
  downloadBtn: string;
  setBackgroundBtn: string;
  toggleAssetBrowserBtn: string;
}

export type DomClasses = Record<string, string>;

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
  addImgInput: string;
  setBackgroundInput: string;
  textInput: string;
}

export type EnvVars = {
  // ROOT ENVIRONMENT VARIABLES
  APP_MODE: 'dev' | 'prod';
  VERSION: string;

  // MAIN ENVIRONMENT VARIABLES
  LOG_LEVEL: 'debug' | 'info' | 'warn' | 'error' | 'silent';
  VERBOSE: boolean;
};

export type ErrorMessages = Record<string, string>;

export interface FilePaths {
  asset_manifest: '/assets/user/assets.manifest.json';
  gifWorkerScript: '/assets/scripts/gif.worker.js';
}

export interface Manifests {
  asset: AssetManifest;
}

export interface Regex {
  floatString: RegExp;
  hex: RegExp;
  integerString: RegExp;
  numberString: RegExp;
}

export interface StorageKeys {
  APP_STATE: string;
}

// ================================================== //

export interface Data {
  assets: AssetData;
  classes: DomClasses;
  defaults: Defaults;
  env_vars: EnvVars;
  error_messages: ErrorMessages;
  file_paths: FilePaths;
  ids: DomIds;
  manifests: Manifests;
  regex: Regex;
  storage_keys: StorageKeys;
}
