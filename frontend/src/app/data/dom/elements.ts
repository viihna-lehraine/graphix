// File: frontend/src/app/data/elements.ts

import { DOMElements } from '../../types/index.js';

// ================================================= //
// ================================================= //

export const domElements: DOMElements = {
  canvas: document.getElementById('memory-canvas') as HTMLCanvasElement | null
} as const;
