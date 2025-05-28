// File: frontend/src/app/data/index.ts

import type { Data } from '../types/index.js';
import { config } from './config/index.js';
import { math } from './math/index.js';
import { msgs } from './msg/index.js';

// ================================================= //
// ================================================= //

export const data: Data = {
  config,
  math,
  msgs
} as const;
