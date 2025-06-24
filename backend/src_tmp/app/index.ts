

import { Core } from '../meta/index.js';
import { env } from './env/index.js';
import { utils } from './utils/index.js';

export const core: Core = {
  env,
  utils
} as const;
