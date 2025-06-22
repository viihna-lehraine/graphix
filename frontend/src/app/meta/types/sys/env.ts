// File: frontend/src/app/meta/types/sys/env.ts

import type { EnvVars } from '../../index.js';

export interface EnvConfig {
  env_import_declaration: string;
  env_var_file: string;
  env_var_file_header: string;
  env_var_file_subheader: string;
  env_var_src_dir: string;
  formatAndExportEnvVars(output: Partial<EnvVars>): string;
  last_timestamp: string;
  printTimestamp: () => string;
  required_keys: (keyof EnvVars)[];
}

export type EnvVarParser<K extends keyof EnvVars> = (
  val: string | undefined
) => EnvVars[K];

export type EnvVarParserMap = {
  [K in keyof EnvVars]: EnvVarParser<K>;
};
