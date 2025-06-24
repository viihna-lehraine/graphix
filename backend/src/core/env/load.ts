// File: backend/src/core/env/load.ts

import type { AppMode, EnvironmentVariables } from '../../meta/index.js';
import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';

function loadEnvFile(filePath: string): Record<string, string> {
  const raw = fs.readFileSync(filePath, 'utf8');
  return dotenv.parse(raw);
}

export function loadEnvironment(): EnvironmentVariables {
  const env = {} as EnvironmentVariables;

  const rootEnvPath = path.resolve('src/config/root.env');
  const { APP_MODE } = loadEnvFile(rootEnvPath);

  if (APP_MODE !== 'dev' && APP_MODE !== 'prod') {
    throw new Error(`Invalid MODE in root.env: got "${APP_MODE}"`);
  }

  env.app_mode = APP_MODE as AppMode;
  const envFile =
    env.app_mode === 'dev'
      ? path.resolve('src/config/dev.env')
      : path.resolve('src/config/prod.env');

  const parsed = loadEnvFile(envFile);

  env.app_version = parsed.APP_VERSION;
  env.base_url = parsed.BASE_URL;
  env.jwt_secret = parsed.JWT_SECRET;
  env.log_dir = parsed.LOG_DIR;
  env.server_host = parsed.SERVER_HOST;
  env.server_port = Number(parsed.PORT);

  if (Number.isNaN(env.server_port)) {
    throw new Error(
      `Invalid PORT in ${env.app_mode}.env: "${parsed.PORT}" is not a number`
    );
  }

  return env;
}
