// File: frontend/src/app/features/canvas/ui/index.ts

import type {
  CanvasIOFunctions,
  CanvasUIFunctions,
  Data,
  MainCanvasFunctions,
  Services,
  TextElementOverlayFunctions,
  Utilities
} from '../../../types/index.js';

// =================================================== //

async function initializeCanvasUI(
  canvasIoFns: CanvasIOFunctions,
  data: Data,
  mainCanvasFns: MainCanvasFunctions,
  services: Services,
  textElementOverlayFns: TextElementOverlayFunctions,
  utils: Utilities
): Promise<void> {
  const { initializeCanvasClearButton } = await import('./btns/clear.js');
  const { initializeCanvasDownloadButton } = await import('./btns/download.js');
  const { initializeCanvasUploadButton } = await import('./btns/upload.js');
  const { setupTextDragHandlers } = await import('./dragText.js');

  const { initializeAddTextForm } = await import('./inputs/text.js');

  initializeCanvasClearButton(data, services);
  initializeCanvasDownloadButton(data, mainCanvasFns, services);
  initializeCanvasUploadButton(canvasIoFns, data, mainCanvasFns, services);

  initializeAddTextForm(data, mainCanvasFns, services);

  setupTextDragHandlers(
    mainCanvasFns.getMainCanvas(data, services),
    data,
    mainCanvasFns,
    services,
    textElementOverlayFns,
    utils
  );
}

// =================================================== //

export const canvasUiFns: CanvasUIFunctions = {
  initialize: initializeCanvasUI
} as const;
