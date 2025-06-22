// File: frontend/src/app/data/defaults.ts

import type { Defaults } from '../meta/index.js';

const defaultRetryAttempts = 5;
const defaultRetryDelayMs = 250;
const defaultSuppessAlert = false;
const defaultSuppressConsole = false;

const defaultBoundaryStrokeStyle = '#ff80c5ff';
const defaultLineDash: [number, number] = [12, 10];

const defaultCanvasWidth = 800;
const defaultCanvasHeight = 600;
const defaultDebounceWait = 100;
const defaultFileName = 'something_broke';
const defaultFileExtension = 'png';

const defaultAnimationFrameCount = 60;
const defaultFont = 'Arial';
const defaultTextColor = '#000000';
const defaultTextAlignment: CanvasTextAlign = 'center';
const defaultTextBaseline: CanvasTextBaseline = 'middle';

const defaultTextElement = {
  font: defaultFont,
  color: defaultTextColor,
  align: defaultTextAlignment,
  baseline: defaultTextBaseline
};

export const defaultValues: Defaults = {
  animation: {
    frameCount: defaultAnimationFrameCount
  },
  blendMode: 'normal',
  boundaryStrokeStyle: defaultBoundaryStrokeStyle,
  canvasWidth: defaultCanvasWidth,
  canvasHeight: defaultCanvasHeight,
  debounceWait: defaultDebounceWait,
  delayMs: defaultRetryDelayMs,
  fileExt: defaultFileExtension,
  fileName: defaultFileName,
  font: defaultFont,
  lineDash: defaultLineDash,
  retryAttempts: defaultRetryAttempts,
  retryDelayMs: defaultRetryDelayMs,
  suppressAlert: defaultSuppessAlert,
  suppressConsole: defaultSuppressConsole,
  textAlignment: defaultTextAlignment,
  textBaseline: defaultTextBaseline,
  textColor: defaultTextColor,
  textElement: defaultTextElement
} as const;
