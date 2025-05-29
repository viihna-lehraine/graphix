// File: frontend/src/app/data/index.ts

import type { Data } from '../types/index.js';
import { assetsData } from './assets/index.js';
import { configData } from './config/index.js';
import { domData } from './dom/index.js';
import { mathData } from './math/index.js';
import { messageData } from './msg/index.js';

// ================================================= //
// ================================================= //

export const data: Data = {
  assets: assetsData,
  config: configData,
  dom: domData,
  math: mathData,
  msgs: messageData
} as const;
