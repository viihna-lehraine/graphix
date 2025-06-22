// File: frontend/src/app/build/env_vars/config.ts

import type { EnvConfig, EnvVars } from '../../meta/index.js';

const env_import_declaration = `import type { EnvVars } from '../../meta/index.js';`;

const env_var_file = '../../../../src/app/config/environment/vars.ts';

const env_var_file_header = `// File: frontend/src/app/config/environment/vars.ts`;

const env_var_file_subheader = `// AUTO-GENERATED FILE. DO NOT EDIT DIRECTLY.`;

function formatAndExportEnvVars(output: Partial<EnvVars>): string {
  return `export const env_vars: EnvVars = ${JSON.stringify(output, null, 2)
    .replace(/"([^"]+)":/g, '$1:')
    .replace(/"/g, `'`)} as const;\n`;
}

const env_var_src_dir = '../../config/environment/files';

const last_timestamp = `// Last generated: ${printTimestamp()}\n`;

function printTimestamp(): string {
  return new Date().toISOString();
}

const required_keys: (keyof EnvVars)[] = ['APP_MODE', 'VERSION'];

// =================================================== //

export const env_config: EnvConfig = {
  env_import_declaration,
  env_var_file,
  env_var_src_dir,
  env_var_file_header,
  env_var_file_subheader,
  formatAndExportEnvVars,
  last_timestamp,
  printTimestamp,
  required_keys
} as const;
