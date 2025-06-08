// File: frontend/src/app/config/data/default.ts

import type { DefaultData, Hex } from '../../types/index.js';

// ================================================== //
// ================================================== //

const defaultCanvasWidth: number = 800;

const defaultCanvasHeight: number = 600;

const defaultDebounceWait: number = 100;

const defaultFileName: string = 'something_broke.png';

// ================================================== //

const defaultTextElementFont: string = 'Arial';
const defaultTextElementColor: Hex = '#000000' as Hex;
const defaultTextElementAlign: CanvasTextAlign = 'center';
const defaultTextElementBaseline: CanvasTextBaseline = 'middle';

const defaultTextElement = {
  font: defaultTextElementFont,
  color: defaultTextElementColor,
  align: defaultTextElementAlign,
  baseline: defaultTextElementBaseline
};

// ================================================== //
// ================================================== //

export const defaultData: DefaultData = {
  canvasWidth: defaultCanvasWidth,
  canvasHeight: defaultCanvasHeight,
  debounceWait: defaultDebounceWait,
  fileName: defaultFileName,
  textElement: defaultTextElement
};
