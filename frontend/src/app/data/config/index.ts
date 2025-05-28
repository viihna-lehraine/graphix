// File: frontend/src/app/config/data/index.ts

import type { ConfigurationData } from '../../types/index.js';
import { defaultData } from './default.js';
import { regexData } from './regex.js';

// ================================================== //
// ================================================== //

export const config: ConfigurationData = {
  default: defaultData,
  regex: regexData
} as const;
