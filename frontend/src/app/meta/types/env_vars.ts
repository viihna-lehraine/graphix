// File: frontend/src/app/meta/types/env_vars.ts

export type EnvVars = {
  // ROOT ENVIRONMENT VARIABLES
  APP_MODE: 'dev' | 'prod';
  VERSION: string;

  // MAIN ENVIRONMENT VARIABLES
  LOG_LEVEL: 'debug' | 'info' | 'warn' | 'error' | 'silent';
  VERBOSE: boolean;
};
