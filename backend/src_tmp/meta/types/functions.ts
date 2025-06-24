

import type { EnvironmentVariables } from '../index.js';

export interface EnvFunctions {
  load: () => EnvironmentVariables;
}

export interface TypeGuards {
  isValidEmail: (email: string) => boolean;
}

export interface Utilities {
  generateProjectSlug: (name: string) => string;
  typeGuards: TypeGuards;
}

export interface Core {
  env: EnvFunctions;
  utils: Utilities;
}
