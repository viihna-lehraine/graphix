// File: frontend/src/app/build/env_vars/main.ts

import type { EnvVars } from '@index';
import { writeFileSync } from 'fs';
import { resolve } from 'path';

console.log(`Building new Environment Variables output file...`);

const { env_config: config } = await import('./config.js');

const src_dir = resolve(import.meta.dirname, config.env_var_src_dir);

const { loadEnvFile, parseEnvVars, writeEnvVars } = await import(
  './partials.js'
);

const root_vars = loadEnvFile(resolve(src_dir, 'root.env'));
const mode = root_vars.APP_MODE || 'dev';

if (!mode) throw new Error(`APP_MODE is not defined in root.env`);

const envFile =
  mode === 'dev'
    ? resolve(src_dir, 'dev.env')
    : mode === 'prod'
      ? resolve(src_dir, 'prod.env')
      : null;

if (!envFile) throw new Error(`Unknown APP_MODE: ${mode}`);

const env_vars = loadEnvFile(envFile);
const merged = { ...root_vars, ...env_vars };

const output: EnvVars = await parseEnvVars(merged);

const output_path = resolve(import.meta.dirname, config.env_var_file);
const file_contents = await writeEnvVars(config, output);

writeFileSync(output_path, file_contents, 'utf-8');

console.log(`Generated env_vars.generated.ts at ${output_path}`);
