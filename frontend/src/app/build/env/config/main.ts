// File: frontend/src/app/build/env/config/main.ts

import type { EnvConfig, EnvVars } from '../../../types/index.js';

const envVarFileHeader = `// File: frontend/src/app/config/env_vars.ts`;
const envVarFileSubHeader = `// AUTO-GENERATED FILE. DO NOT EDIT DIRECTLY.`;
const env_vars_file = '../../../../src/app/config/env_vars.ts';
const requiredKeys: (keyof EnvVars)[] = ['APP_MODE', 'VERSION'];

export const envConfig: EnvConfig = {
  envVarFileHeader,
  envVarFileSubHeader,
  env_vars_file,
  requiredKeys
} as const;
