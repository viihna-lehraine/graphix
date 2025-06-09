// File: frontend/src/app/features/engine/initialize/main.ts

import type {
  CanvasIOFunctions,
  Data,
  Helpers,
  Services,
  TextElementOverlayFunctions,
  Utilities
} from '../../../types/index.js';

// =================================================== //

async function initializeCanvasUI(
  canvasIoFns: CanvasIOFunctions,
  data: Data,
  helpers: Helpers,
  services: Services,
  textElementOverlayFns: TextElementOverlayFunctions,
  utils: Utilities
): Promise<void> {
  const { initializeCanvasClearButton } = await import('./clearBtn.js');
  const { initializeCanvasDownloadButton } = await import('./downloadBtn.js');
  const { initializeCanvasUploadButton } = await import('./uploadBtn.js');
  const { initializeTextInputForm } = await import('./textInput.js');
  const { setupTextDragHandlers } = await import('../events/dragText.js');

  const canvas = utils.canvas.getCanvasElement();

  initializeCanvasClearButton(data, helpers, services, utils);
  initializeCanvasDownloadButton(data, canvasIoFns, helpers, services, utils);
  await initializeCanvasUploadButton(
    canvasIoFns,
    data,
    helpers,
    services,
    utils
  );
  initializeTextInputForm(data, services, utils);
  setupTextDragHandlers(
    canvas,
    data,
    helpers,
    services,
    textElementOverlayFns,
    utils
  );
}

// =================================================== //

export { initializeCanvasUI };
