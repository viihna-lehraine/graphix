// File: backend/src/meta/data/config.ts

import type { ConfigurationData } from '../types/index.js';

const jwt_expiration = '1h';

export const config: ConfigurationData = {
  jwt_expiration
} as const;
