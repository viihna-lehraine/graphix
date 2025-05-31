// File: frontend/src/app/config/data/default.ts

import type { DefaultData } from '../../types/index.js';

// ================================================== //
// ================================================== //

const defaultCanvasWidth: number = 800;

const defaultCanvasHeight: number = 600;

const defaultDebounceWait: number = 100;

const defaultFileName: string = 'something_broke.png';

// ================================================== //
// ================================================== //

export const defaultData: DefaultData = {
  canvasWidth: defaultCanvasWidth,
  canvasHeight: defaultCanvasHeight,
  debounceWait: defaultDebounceWait,
  fileName: defaultFileName
};
