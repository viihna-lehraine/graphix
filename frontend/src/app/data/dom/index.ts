// File: frontend/src/app/data/dom/index.ts

import type { DOMData } from '../../types/index.js';
import { domElements } from './elements.js';

// ================================================== //
// ================================================== //

export const domData: DOMData = {
  elements: domElements
} as const;
