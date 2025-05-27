// File: frontend/src/scripts/react/components/buttons/Download.tsx

import '../../../../styles/main.css';
import type { DownloadButtonProps } from '../../../types/index.js';
import { JSX } from 'react';
import html2canvas from 'html2canvas';
import { defaultData } from '../../../config/data/default.js';

// =================================================== //
// =================================================== //

export function DownloadButton({
  targetRef,
  fileName = defaultData.fileName
}: DownloadButtonProps): JSX.Element {
  const handleDownload = async (): Promise<void> => {
    if (!targetRef.current) return;

    const canvas = await html2canvas(targetRef.current, { backgroundColor: null });
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');

    link.href = url;
    link.download = fileName;
    link.click();
  };

  return (
    <button id="download-button" onClick={handleDownload} type="button">
      <span role="img" aria-label="sparkles">
        ✨
      </span>
      Download as PNG
      <span role="img" aria-label="sparkles">
        ✨
      </span>
    </button>
  );
}
