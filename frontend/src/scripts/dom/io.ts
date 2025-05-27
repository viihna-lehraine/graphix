// File: frontend/src/scripts/dom/io.ts

import type { IOFunctions } from '../types/index.js';
import React from 'react';
import html2canvas from 'html2canvas';
import { defaultData } from '../config/data/default.js';

// =================================================== //
// =================================================== //

async function handleDownload(
  targetRef: React.RefObject<HTMLDivElement | null>,
  fileName: string = defaultData.fileName
): Promise<void> {
  if (!targetRef.current) return;

  const canvas = await html2canvas(targetRef.current, { backgroundColor: null });
  const url = canvas.toDataURL('image/png');
  const link = document.createElement('a');

  link.href = url;
  link.download = fileName;
  link.click();
}

// =================================================== //
// =================================================== //

export const ioFunctions: IOFunctions = {
  handleDownload
} as const;
