// File: frontend/src/app/config/msg/index.ts

import type { AppMessages } from '../../types/index.js';
import { errorMessages } from './errors.js';

// ================================================== //
// ================================================== //

export const msgs: AppMessages = {
  errors: errorMessages
} as const;
