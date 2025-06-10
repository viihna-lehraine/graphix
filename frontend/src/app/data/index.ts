// File: frontend/src/app/data/index.ts

import type { Data } from '../types/index.js';
import { assetsData } from './assets.js';
import { baseData } from './base.js';
import { configData } from './config.js';
import { domData } from './dom.js';
import { flags } from './flags.js';
import { messageData } from './messages.js';

export const data: Data = {
  ...baseData,
  assets: assetsData,
  config: configData,
  dom: domData,
  flags: flags,
  msgs: messageData
} as const;
