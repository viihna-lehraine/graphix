

import type { EnvFunctions } from '../../meta/index.js';
import { loadEnvironment } from './load.js';

export const env: EnvFunctions = {
  load: loadEnvironment
} as const;
