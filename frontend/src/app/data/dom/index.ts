// File: frontend/src/app/data/dom/index.ts

import type { DomData } from '../../types/index.js';
import { classes } from './classes.js';
import { domIDs } from './ids.js';

// ================================================== //
// ================================================== //

export const domData: DomData = {
  classes,
  ids: domIDs
} as const;
