// File: frontend/src/scripts/config/data/index.ts

import type { Data } from '../../types/index.js';
import { defaultData } from './default.js';
import { domData } from './dom.js';
import { regexData } from './regex.js';

// ================================================== //
// ================================================== //

export const data: Data = {
  default: defaultData,
  dom: domData,
  regex: regexData
} as const;
