// File: frontend/src/app/data/defaults.ts

import type { Defaults, FitMode } from '@index';

export const defaultValues: Defaults = {
  animation: { frameCount: 60 },
  bgFitMode: 'fit' as FitMode,
  blendMode: 'normal',
  boundaryStrokeStyle: '#ff80c5ff',
  canvasWidth: 800,
  canvasHeight: 600,
  debounceWait: 100,
  fileExt: 'png',
  fileName: 'something',
  font: 'Arial',
  lineDash: [12, 10] as [number, number],
  retryAttempts: 5,
  retryDelayMs: 500,
  suppressAlert: false,
  suppressConsole: false,
  textAlignment: 'center' as CanvasTextAlign,
  textBaseline: 'middle' as CanvasTextBaseline,
  textColor: '#000000',
  textElement: {
    font: 'Arial',
    color: '#000000',
    align: 'center' as CanvasTextAlign,
    baseline: 'middle' as CanvasTextBaseline
  }
} as const;
