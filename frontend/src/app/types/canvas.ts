// File: frontend/src/app/types/canvas.ts

import type { Hex } from './index.js';

// ================================================== //
// ================================================== //

export interface TextElement {
  text: string;
  x: number;
  y: number;
  font: string;
  fontFamily?: string;
  fontSize: number;
  fontWeight?: string;
  color: Hex;
  align: CanvasTextAlign;
  baseline: CanvasTextBaseline;
}
