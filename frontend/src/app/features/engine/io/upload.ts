// File: frontend/src/app/features/engine/io/upload.ts

import type {
  CanvasIOFunctions,
  Data,
  GifAnimation,
  Helpers,
  Services,
  SupportedExt,
  Utilities
} from '../../../types/index.js';

// ================================================== //

async function handleUpload(
  file: File,
  data: Data,
  helpers: Helpers,
  services: Services,
  utils: Utilities,
  createGifAnimation: (arrayBuffer: ArrayBuffer) => GifAnimation
): Promise<void> {
  const { canvasCache, errors } = services;
  const { typeguards } = utils;
  const ids = data.dom.ids;

  return errors.handleAsync(async () => {
    const fileName = file.name;
    const ext = fileName.split('.').pop()?.toLowerCase() ?? '';

    if (!typeguards.isSupportedExt(ext)) {
      throw new Error(`Unsupported file extension: .${ext || '[none]'}`);
    }

    const canvas = document.getElementById(
      ids.canvas
    ) as HTMLCanvasElement | null;
    if (!canvas) throw new Error(`Canvas element not found.`);

    const ctx = helpers.canvas.get2DContext(canvas);

    // GIF support
    if (ext === ('gif' as SupportedExt)) {
      const arrayBuffer = await file.arrayBuffer();
      const anim = createGifAnimation(arrayBuffer);

      services.stateManager.setCanvasAnimation(anim);

      anim.play(ctx);

      // don't run static image logic!
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        const imgAspect = img.width / img.height;
        const imageDataUrl = e.target?.result as string;

        services.stateManager.setCanvasImage(imageDataUrl);
        services.stateManager.setCanvasAspectRatio(imgAspect);

        canvasCache.cachedBgImg = img;

        canvas.style.width = 'auto';
        canvas.style.height = 'auto';

        const canvasAspect = canvas.width / canvas.height;
        let drawWidth, drawHeight, offsetX, offsetY;
        if (imgAspect > canvasAspect) {
          drawWidth = canvas.width;
          drawHeight = canvas.width / imgAspect;
          offsetX = 0;
          offsetY = (canvas.height - drawHeight) / 2;
        } else {
          drawHeight = canvas.height;
          drawWidth = canvas.height * imgAspect;
          offsetY = 0;
          offsetX = (canvas.width - drawWidth) / 2;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, 'File upload processing failed.');
}

// ================================================== //

export const canvasUploadFns: CanvasIOFunctions['upload'] = {
  handle: handleUpload
} as const;
