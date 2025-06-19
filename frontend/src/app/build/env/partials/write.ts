// File: frontend/src/app/build/env/partials/write.ts

import type { EnvConfig, EnvVars } from '../../../types/index.js';

export async function writeEnvVars(
  envConfig: EnvConfig,
  output: Partial<EnvVars>
): Promise<string> {
  return (
    `${envConfig.envVarFileHeader}\n` +
    `\n` +
    `${envConfig.envVarFileSubHeader}\n` +
    `\n` +
    `import type { EnvVars } from '../types/index.js';\n` +
    `\n` +
    `export const env: EnvVars = ${JSON.stringify(output, null, 2)};`
  );
}
