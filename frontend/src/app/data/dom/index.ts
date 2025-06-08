// File: frontend/src/app/data/dom/index.ts

import type { DOMData } from '../../types/index.js';
import { classes } from './classes.js';
import { domIDs } from './ids.js';

// ================================================== //
// ================================================== //

export const domData: DOMData = {
  classes,
  ids: domIDs
} as const;
