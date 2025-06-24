// File: backend/src/meta/data/index.ts

import type { Data } from '../index.js';
import { config } from './config.js';
import { regex } from './regex.js';
import { routes } from './routes.js';

export const data: Data = {
  config,
  regex,
  routes
} as const;
