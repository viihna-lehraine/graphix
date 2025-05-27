// File: frontend/src/scripts/dom/index.ts

import type { DOMFunctions } from '../types/index.js';
import { ioFunctions } from './io.js';

// ================================================== //
// ================================================== //

export const domFunctions: DOMFunctions = {
  io: ioFunctions
} as const;
