// File: frontend/src/app/features/canvas/ui/index.ts

import type {
  CanvasIOFunctions,
  CanvasUIFunctions,
  Data,
  MainCanvasFunctions,
  Services
} from '../../../types/index.js';

// =================================================== //
// =================================================== //

async function initializeCanvasUI(
  canvasIoFns: CanvasIOFunctions,
  data: Data,
  mainCanvasFns: MainCanvasFunctions,
  services: Services
): Promise<void> {
  const { initializeCanvasClearButton } = await import('./buttons/clear.js');
  const { initializeCanvasDownloadButton } = await import(
    './buttons/download.js'
  );
  const { initializeCanvasUploadButton } = await import('./buttons/upload.js');

  initializeCanvasClearButton(data, mainCanvasFns, services);
  initializeCanvasDownloadButton(data, mainCanvasFns, services);
  initializeCanvasUploadButton(canvasIoFns, data, mainCanvasFns, services);
}

// =================================================== //

// =================================================== //
// =================================================== //

export const canvasUiFns: CanvasUIFunctions = {
  initialize: initializeCanvasUI
} as const;
