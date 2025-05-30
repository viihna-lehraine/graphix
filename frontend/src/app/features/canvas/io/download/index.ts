// File: frontend/src/app/features/canvas/io/download/index.ts

import type { CanvasIOFunctions, Services } from '../../../../types/index.js';
import html2canvas from 'html2canvas';

// =================================================== //

const { data } = await import('../../../../data/index.js');

// =================================================== //
// =================================================== //

async function handleDownload(
  fileName: string | null,
  targetRef: React.RefObject<HTMLDivElement | null>,
  services: Services
): Promise<void> {
  if (!fileName) fileName = data.config.default.fileName;
  const { errors } = services;

  return errors.handleAsync(async () => {
    if (!targetRef.current) {
      console.error('Target reference is null or undefined.');
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
// =================================================== //

export const canvasDownloadFns: CanvasIOFunctions['download'] = {
  handle: handleDownload
} as const;
