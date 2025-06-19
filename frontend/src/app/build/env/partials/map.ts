// File: frontend/src/app/build/env/partials/map.ts

import type { EnvVarParserMap, EnvVars } from '../../../types/index.js';

export const ENV_VAR_MAP: EnvVarParserMap = {
  // ==========================================
  // ROOT ENVIRONMENT VARIABLES
  // ==========================================

  APP_MODE: val => {
    if (val === 'dev' || val === 'prod') return val;
    throw new Error(`Invalid APP_MODE: ${val}`);
  },
  VERSION: val => val ?? '',

  // ==========================================
  // MAIN ENVIRONMENT VARIABLES
  // ==========================================

  LOG_LEVEL: val => {
    const allowed = ['debug', 'info', 'warn', 'error', 'silent'];
    if (val && allowed.includes(val)) return val as EnvVars['LOG_LEVEL'];
    throw new Error(`Invalid LOG_LEVEL: ${val}`);
  },
  VERBOSE: val => {
    if (val === 'true' || val === '1') return true;
    if (val === 'false' || val === '0') return false;
    throw new Error(`Invalid VERBOSE: ${val}`);
  }
} as const;
