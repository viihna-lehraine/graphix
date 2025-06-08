// File: frontend/src/app/features/canvas/ui/btns/download.ts

import type {
  Data,
  MainCanvasFunctions,
  Services
} from '../../../../types/index.js';

export function initializeCanvasDownloadButton(
  data: Data,
  mainCanvasFns: MainCanvasFunctions,
  services: Services
): void {
  const { errors, log } = services;

  return errors.handleSync(() => {
    const btnId = data.dom.ids.btns.download;
    const btn = document.getElementById(btnId) as HTMLButtonElement | null;

    if (!btn) throw new Error(`Download button not found!`);

    btn.addEventListener('click', () => {
      const canvas = mainCanvasFns.getMainCanvas(data, services);

      canvas.toBlob(blob => {
        if (!blob) {
          log.error(
            'Canvas could not be converted to blob.',
            'initializeCanvasDownloadButton'
          );
          return;
        }

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'glitter-creation.png';
        a.click();
        URL.revokeObjectURL(url);

        log.info(`Canvas downloaded successfully.`);
      }, 'image/png');
    });

    log.debug(`Download Button listener successfully attached.`);
  }, 'Unhandled Download Button initialization error.');
}
