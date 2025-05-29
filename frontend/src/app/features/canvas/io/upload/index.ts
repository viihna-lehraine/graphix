// File: frontend/src/app/features/canvas/io/upload/index.ts

import type {
  CanvasFunctions,
  Data,
  IOFunctions,
  Services
} from '../../../../types/index.js';

// ================================================== //
// ================================================== //

async function handleUpload(
  data: Data,
  canvasFns: CanvasFunctions,
  services: Services
): Promise<void> {
  const { errors } = services;

  return errors.handleAsync(async () => {
    const ids = data.dom.ids;

    const canvas = document.getElementById(
      ids.canvas
    ) as HTMLCanvasElement | null;

    if (!canvas)
      throw new Error(`Canvas element with ID '${ids.canvas}' not found.`);

    const ctx = canvasFns.main.get2DContext(canvas, services);

    const uploadBtn = document.getElementById(
      ids.btns.upload
    ) as HTMLButtonElement | null;
    const imgInput = document.getElementById(
      ids.inputs.imgUpload
    ) as HTMLInputElement | null;

    if (!uploadBtn) {
      throw new Error('Upload button not found.');
    } else if (!imgInput) {
      throw new Error('Image upload input not found.');
    }

    // button click opens file dialog
    uploadBtn.addEventListener('click', () => imgInput.click());

    // on file select, load image and draw to canvas
    imgInput.addEventListener('change', () => {
      const file = imgInput.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const img = new Image();
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height); // stretch to fit canvas
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  }, 'File upload failed.');
}

// ================================================== //
// ================================================== //

export const canvasUploadFns: IOFunctions['upload'] = {
  handle: handleUpload
} as const;
