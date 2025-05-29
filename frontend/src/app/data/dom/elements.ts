// File: frontend/src/app/data/elements.ts

import { DOMElements } from '../../types/index.js';

// ================================================= //

const { domIDs } = await import('./ids.js');

// ================================================= //
// ================================================= //

export const domElements: DOMElements = {
  canvas: document.getElementById(domIDs.canvas) as HTMLCanvasElement | null
} as const;
