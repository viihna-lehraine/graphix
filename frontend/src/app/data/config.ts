// File: frontend/src/app/core/data/config.ts

import type { ConfigData, Defaults, Paths, Regex } from '../types/index.js';

// ================================================== //

const defaultCanvasWidth: number = 800;
const defaultCanvasHeight: number = 600;
const defaultDebounceWait: number = 100;
const defaultFileName: string = 'something_broke';

const defaultAnimationFrameCount: number = 60;
const defaultFont: string = 'Arial';
const defaultTextColor = '#000000';
const defaultTextAlignment: CanvasTextAlign = 'center';
const defaultTextBaseline: CanvasTextBaseline = 'middle';

const defaultTextElement = {
  font: defaultFont,
  color: defaultTextColor,
  align: defaultTextAlignment,
  baseline: defaultTextBaseline
};

const defaults: Defaults = {
  animation: {
    frameCount: defaultAnimationFrameCount
  },
  blendMode: 'normal',
  canvasWidth: defaultCanvasWidth,
  canvasHeight: defaultCanvasHeight,
  debounceWait: defaultDebounceWait,
  fileName: defaultFileName,
  font: defaultFont,
  textAlignment: defaultTextAlignment,
  textBaseline: defaultTextBaseline,
  textColor: defaultTextColor,
  textElement: defaultTextElement
};

// ================================================== //

const paths: Paths = {
  asset_manifest: '/assets/user/assets.manifest.json',
  gifWorkerScript: '/assets/scripts/gif.worker.js'
} as const;

// ================================================== //

const floatString: RegExp = /^[-+]?\d*\.\d+(e[-+]?\d+)?$/i;
const hex: RegExp = /^#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;
const integerString: RegExp = /^[-+]?\d+$/i;
const numberString: RegExp = /^[-+]?\d*\.?\d+(e[-+]?\d+)?$/i;

export const regex: Regex = {
  floatString,
  hex,
  integerString,
  numberString
} as const;

// =================================================== //

export const configData: ConfigData = {
  defaults,
  paths,
  regex
} as const;
