// File: frontend/src/app/features/engine/io/download.ts

import GIF from 'gif.js';
import html2canvas from 'html2canvas';
import type {
  CanvasIOFunctions,
  Services,
  Utilities,
  VisualLayer
} from '../../../types/index.js';

const { data } = await import('../../../data/index.js');

// =================================================== //

async function exportGif(
  layers: VisualLayer[],
  width: number,
  height: number,
  frameCount: number = 60,
  fileName: string = 'default.gif',
  utils: Utilities
): Promise<void> {
  return new Promise((resolve, reject) => {
    const gif = new GIF({
      workers: 2,
      quality: 10,
      width,
      height,
      workerScript: '???????' // TODO: FIGURE IT THE FUCK OUT
    });

    const offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = width;
    offscreenCanvas.height = height;

    const offCtx = offscreenCanvas.getContext('2d');
    if (!offCtx) {
      reject(new Error('Offscreen canvas 2D context unavailable'));
      return;
    }

    const baseFrameDelay = 100; // ms/frame

    for (let frameIndex = 0; frameIndex < frameCount; frameIndex++) {
      // step GIF layers to this frame
      for (const layer of layers) {
        if (layer.type === 'gif') {
          layer.currentFrame = frameIndex % layer.gifFrames.length;
        }
      }

      // draw this frame
      offCtx.clearRect(0, 0, width, height);
      utils.canvas.drawVisualLayers(offCtx, layers);

      // add frame to GIF
      gif.addFrame(offCtx, { copy: true, delay: baseFrameDelay });
    }

    gif.on('finished', (blob: Blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
      resolve();
    });

    (gif as any).on('error', (error: unknown) => {
      reject(error);
    });

    gif.render();
  });
}

async function exportStaticFile(
  layers: VisualLayer[],
  width: number,
  height: number,
  fileName: string = 'default.png',
  utils: Utilities
): Promise<void> {
  const offscreenCanvas = document.createElement('canvas');
  offscreenCanvas.width = width;
  offscreenCanvas.height = height;

  const offCtx = offscreenCanvas.getContext('2d');
  if (!offCtx) throw new Error('Offscreen canvas 2D context unavailable');

  offCtx.clearRect(0, 0, width, height);

  // draw all layers
  utils.canvas.drawVisualLayers(offCtx, layers);

  // export as PNG
  offscreenCanvas.toBlob(blob => {
    if (!blob) throw new Error('Failed to generate PNG blob');

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  }, 'image/png');
}

async function handle(
  fileName: string | null,
  targetRef: React.RefObject<HTMLDivElement | null>,
  services: Services
): Promise<void> {
  if (!fileName) fileName = data.config.default.fileName;
  const { errors, log } = services;

  return errors.handleAsync(async () => {
    if (!targetRef.current) {
      log.error('Target reference is null or undefined.', 'handleDownload');
      return;
    }

    const canvas = await html2canvas(targetRef.current, {
      backgroundColor: null
    });
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
  }, 'File download failed.');
}

// =================================================== //

export const canvasDownloadFns: CanvasIOFunctions['download'] = {
  exportGif,
  exportStaticFile,
  handle
} as const;
