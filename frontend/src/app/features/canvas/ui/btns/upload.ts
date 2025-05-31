// File: frontend/src/app/features/canvas/ui/btns/upload.ts

import type {
  CanvasIOFunctions,
  Data,
  MainCanvasFunctions,
  Services
} from '../../../../types/index.js';

// ================================================== //
// ================================================== //

export function initializeCanvasUploadButton(
  canvasIoFns: CanvasIOFunctions,
  data: Data,
  mainCanvasFns: MainCanvasFunctions,
  services: Services
): void {
  const { errors } = services;

  return errors.handleSync(() => {
    const uploadBtn = document.getElementById(
      data.dom.ids.btns.upload
    ) as HTMLButtonElement | null;
    const imgInput = document.getElementById(
      data.dom.ids.inputs.imgUpload
    ) as HTMLInputElement | null;

    if (!uploadBtn) throw new Error('Upload button not found.');
    if (!imgInput) throw new Error('Image upload input not found.');

    // button click opens file dialog
    uploadBtn.addEventListener('click', () => imgInput.click());

    // file select triggers upload logic
    imgInput.addEventListener('change', () => {
      const file = imgInput.files?.[0];
      if (!file) return;

      canvasIoFns.upload.handle(file, data, mainCanvasFns, services);
    });
  }, 'Failed to initialize upload UI.');
}
