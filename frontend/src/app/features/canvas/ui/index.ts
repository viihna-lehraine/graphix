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
  const { initializeCanvasClearButton } = await import('./btns/clear.js');
  const { initializeCanvasDownloadButton } = await import('./btns/download.js');
  const { initializeCanvasUploadButton } = await import('./btns/upload.js');

  const { initializeAddTextForm } = await import('./inputs/text.js');

  initializeCanvasClearButton(data, mainCanvasFns, services);
  initializeCanvasDownloadButton(data, mainCanvasFns, services);
  initializeCanvasUploadButton(canvasIoFns, data, mainCanvasFns, services);

  initializeAddTextForm(data, mainCanvasFns, services);
}

// =================================================== //

// =================================================== //
// =================================================== //

export const canvasUiFns: CanvasUIFunctions = {
  initialize: initializeCanvasUI
} as const;
