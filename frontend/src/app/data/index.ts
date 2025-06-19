// File: frontend/src/app/data/index.ts

import type { Data } from '../types/index.js';
import { assetsData } from './assets.js';
import { configData } from './config.js';
import { domData } from './dom.js';
import { flags } from './flags.js';
import { messageData } from './messages.js';
import { storage_keys } from './storage_keys.js';

export const data: Data = {
  assets: assetsData,
  config: configData,
  dom: domData,
  flags: flags,
  msgs: messageData,
  storage_keys
} as const;
