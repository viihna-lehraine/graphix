// File: frontend/src/app/features/engine/io/index.ts

import type { CanvasIOFunctions } from '../../../types/index.js';
import { canvasDownloadFns } from './download.js';
import { canvasUploadFns } from './upload.js';

// =================================================== //

export const canvasIoFns: CanvasIOFunctions = {
  download: canvasDownloadFns,
  upload: canvasUploadFns
} as const;
