// File: frontend/src/app/features/canvas/io/upload/index.ts

import type {
  CanvasIOFunctions,
  Data,
  MainCanvasFunctions,
  Services
} from '../../../../types/index.js';

// ================================================== //
// ================================================== //

async function handleUpload(
  file: File,
  data: Data,
  mainCanvasFns: MainCanvasFunctions,
  services: Services
): Promise<void> {
  const { errors } = services;

  return errors.handleAsync(async () => {
    const canvas = document.getElementById(
      data.dom.ids.canvas
    ) as HTMLCanvasElement | null;
    if (!canvas) throw new Error(`Canvas element not found.`);

    const ctx = mainCanvasFns.get2DContext(canvas, services);

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height); // TODO: fix this. using stretched fit for now
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, 'File upload processing failed.');
}

// ================================================== //
// ================================================== //

export const canvasUploadFns: CanvasIOFunctions['upload'] = {
  handle: handleUpload
} as const;
