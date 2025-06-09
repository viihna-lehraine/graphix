// File: frontend/src/app/config/data/defaults.ts

import type { DefaultData, Hex } from '../../types/index.js';

// ================================================== //

const defaultCanvasWidth: number = 800;
const defaultCanvasHeight: number = 600;
const defaultDebounceWait: number = 100;
const defaultFileName: string = 'something_broke.png';

// ================================================== //

const defaultAnimationFrameCount: number = 60;
const defaultFont: string = 'Arial';
const defaultTextColor: Hex = '#000000' as Hex;
const defaultTextAlignment: CanvasTextAlign = 'center';
const defaultTextBaseline: CanvasTextBaseline = 'middle';

const defaultTextElement = {
  font: defaultFont,
  color: defaultTextColor,
  align: defaultTextAlignment,
  baseline: defaultTextBaseline
};

// ================================================== //

export const defaultData: DefaultData = {
  animation: {
    frameCount: defaultAnimationFrameCount
  },
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
