

import type { Utilities } from '../../meta/index.js';
import { generateProjectSlug } from './slug.js';
import { typeGuards } from './typeguards.js';

export const utils: Utilities = {
  generateProjectSlug,
  typeGuards
} as const;
