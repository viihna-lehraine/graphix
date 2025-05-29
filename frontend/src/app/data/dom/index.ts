// File: frontend/src/app/data/dom/index.ts

import type { DOMData } from '../../types/index.js';
import { domElements } from './elements.js';
import { domIDs } from './ids.js';

// ================================================== //
// ================================================== //

export const domData: DOMData = {
  elements: domElements,
  ids: domIDs
} as const;
