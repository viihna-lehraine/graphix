// File: frontend/src/app/build/env/partials/load.ts

import { parse as dotenvParse } from 'dotenv';
import { readFileSync } from 'fs';

export function loadEnvFile(path: string): Record<string, string> {
  try {
    const content = readFileSync(path, 'utf-8');
    return dotenvParse(content);
  } catch (error) {
    throw new Error(`Could not load env file: ${path}. Error: ${error}`);
  }
}
