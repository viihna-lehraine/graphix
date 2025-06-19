// File: frontend/src/app/build/env/main.ts

import type { EnvVars } from '../../types/index.js';
import { writeFileSync } from 'fs';
import { resolve } from 'path';

console.log(`Generating env_vars TypeScript file...`);

const configDir = resolve(import.meta.dirname, './config');
const { loadEnvFile } = await import('./partials/load.js');
const rootVars = loadEnvFile(resolve(configDir, 'root.env'));
const mode = rootVars.APP_MODE || 'dev';

if (!mode) throw new Error(`APP_MODE is not defined in root.env`);

const envFile =
  mode === 'dev'
    ? resolve(configDir, 'dev.env')
    : mode === 'prod'
      ? resolve(configDir, 'prod.env')
      : null;

if (!envFile) throw new Error(`Unknown APP_MODE: ${mode}`);

const envVars = loadEnvFile(envFile);
const merged = { ...rootVars, ...envVars };
const { envConfig } = await import('./config/main.js');

const { parseEnvVars } = await import('./partials/parse.js');
const output: EnvVars = await parseEnvVars(merged);

const outputPath = resolve(import.meta.dirname, envConfig.env_vars_file);
const { writeEnvVars } = await import('./partials/write.js');
const fileContents = await writeEnvVars(envConfig, output);

writeFileSync(outputPath, fileContents, 'utf-8');

console.log(`Generated env_vars.generated.ts at ${outputPath}`);
