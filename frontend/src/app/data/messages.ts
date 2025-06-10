// File: frontend/src/app/config/core/messages.ts

import type { ErrorMessages, MessageData } from '../types/index.js';

const unknownFatalError =
  'An unknown fatal error has occurred. Please refresh the page and try again. If the problem persists, please contact support.';

const errorMessages: ErrorMessages = {
  unknownFatalError
};

// ================================================== //

export const messageData: MessageData = {
  errors: errorMessages
} as const;
