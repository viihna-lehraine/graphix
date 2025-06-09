// File: frontend/src/app/features/engine/initialize/uploadBtn.ts

import type {
  CanvasIOFunctions,
  Data,
  Helpers,
  Services,
  Utilities
} from '../../../types/index.js';

// ================================================== //

export async function initializeCanvasUploadButton(
  canvasIoFns: CanvasIOFunctions,
  data: Data,
  helpers: Helpers,
  services: Services,
  utils: Utilities
): Promise<void> {
  const { errors } = services;
  const { createGifAnimation } = await import('../animation/main.js');

  return errors.handleAsync(async () => {
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

      canvasIoFns.upload.handle(
        file,
        data,
        helpers,
        services,
        utils,
        createGifAnimation
      );
    });
  }, 'Failed to initialize upload UI.');
}
