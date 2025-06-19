// File: frontend/src/app/types/app/env.ts

export interface EnvConfig {
  envVarFileHeader: string;
  envVarFileSubHeader: string;
  env_vars_file: string;
  requiredKeys: (keyof EnvVars)[];
}

export type EnvVarParser<K extends keyof EnvVars> = (
  val: string | undefined
) => EnvVars[K];

export type EnvVarParserMap = {
  [K in keyof EnvVars]: EnvVarParser<K>;
};

export type EnvVars = {
  // ROOT ENVIRONMENT VARIABLES
  APP_MODE: 'dev' | 'prod';
  VERSION: string;

  // MAIN ENVIRONMENT VARIABLES
  LOG_LEVEL: 'debug' | 'info' | 'warn' | 'error' | 'silent';
  VERBOSE: boolean;
};
