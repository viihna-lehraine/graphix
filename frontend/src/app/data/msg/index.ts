// File: frontend/src/app/config/msg/index.ts

import type { MessageData } from '../../types/index.js';
import { errorMessages } from './errors.js';

// ================================================== //
// ================================================== //

export const messageData: MessageData = {
  errors: errorMessages
} as const;
