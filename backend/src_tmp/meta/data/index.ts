

import type { Data } from '../index.js';
import { config } from './config.js';
import { regex } from './regex.js';

export const data: Data = {
  config,
  regex
} as const;
