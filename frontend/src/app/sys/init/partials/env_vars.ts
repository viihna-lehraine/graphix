// File: frontend/src/app/sys/init/partials/env_vars.ts

import type { EnvVars } from '../../../types/index.js';

export async function initializeEnvVars(): Promise<Required<EnvVars>> {
  console.log(`Initializing EnvVars object...`);

  try {
    const { env } = await import('../../../config/env_vars.js');

    return env;
  } catch (error) {
    console.error(`Failed to initialize EnvVars:`, error);
    throw new Error(`EnvVars initialization failed`);
  }
}
