// File: backend/src/meta/types/env.ts

export type AppMode = 'dev' | 'prod';

export interface EnvironmentVariables {
  app_mode: AppMode;
  app_version: string;
  base_url: string;
  jwt_secret: string;
  log_dir: string;
  server_host: string;
  server_port: number;
}
