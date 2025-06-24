

import type { ConfigurationData } from '../types/index.js';

const jwtExpiration = '1h';

export const config: ConfigurationData = {
  jwtExpiration
} as const;
