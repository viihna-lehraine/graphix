// File: frontend/src/app/build/env/partials/parse.ts

import type { EnvVars } from '../../../types/index.js';

export async function parseEnvVars(
  raw: Record<string, string | undefined>
): Promise<EnvVars> {
  try {
    const { ENV_VAR_MAP } = await import('./map.js');

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
        throw new Error(`Missing value for env var: ${key}`);
    }

    return result;
  } catch (error) {
    console.error(`Failed to parse environment variables:`, error);
    throw error;
  }
}
