// File: frontend/src/app/build/env_vars/partials.ts

import type { EnvConfig, EnvVarParserMap, EnvVars } from '@index';
import { parse as dotenvParse } from 'dotenv';
import { readFileSync } from 'fs';

export const ENV_VAR_MAP: EnvVarParserMap = {
  // ==========================================
  // ROOT VARIABLES
  // ==========================================

  APP_MODE: val => {
    if (val === 'dev' || val === 'prod') return val;
    throw new Error(`Invalid APP_MODE: ${val}`);
  },
  VERSION: val => val ?? '',

  // ==========================================
  // MAIN VARIABLES
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

export function loadEnvFile(path: string): Record<string, string> {
  try {
    const content = readFileSync(path, 'utf-8');

    return dotenvParse(content);
  } catch (error) {
    throw new Error(`Could not load env file: ${path}. Error: ${error}`);
  }
}

export async function parseEnvVars(
  raw: Record<string, string | undefined>
): Promise<EnvVars> {
  try {
    const result = (Object.keys(ENV_VAR_MAP) as (keyof EnvVars)[]).reduce(
      (acc, key) => {
        const parser = ENV_VAR_MAP[key];

        acc[key] = parser(raw[key]) as EnvVars[typeof key];

        return acc;
      },
      {} as Record<keyof EnvVars, EnvVars[keyof EnvVars]>
    ) as EnvVars;

    for (const key of Object.keys(ENV_VAR_MAP) as (keyof EnvVars)[]) {
      if (result[key] === undefined)
        throw new Error(`Missing value for environment variable: ${key}`);
    }

    return result;
  } catch (error) {
    console.error(`Failed to parse environment variables:`, error);
    throw error;
  }
}

export async function writeEnvVars(
  config: EnvConfig,
  output: Partial<EnvVars>
): Promise<string> {
  try {
    return (
      `${config.env_var_file_header}\n` +
      `\n` +
      `${config.env_var_file_subheader}\n` +
      `\n` +
      `${config.last_timestamp}\n` +
      `\n` +
      `${config.env_import_declaration}\n` +
      `\n` +
      `${config.formatAndExportEnvVars(output)}\n`
    );
  } catch (error) {
    console.error(`Failed to write environment variables > :`, error);
    throw error;
  }
}
