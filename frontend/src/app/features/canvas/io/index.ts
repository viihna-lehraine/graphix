// File: frontend/src/app/features/canvas/io/index.ts

import type { IOFunctions } from '../../../types/index.js';
import { canvasDownloadFns } from './download/index.js';
import { canvasUploadFns } from './upload/index.js';

// =================================================== //
// =================================================== //

export const ioFns: IOFunctions = {
  download: canvasDownloadFns,
  upload: canvasUploadFns
} as const;
