// File: backend/src/core/utils/typeguards.ts

import type { TypeGuards } from '../../meta/index.js';
import { data } from '../../meta/index.js';

const { regex } = data;

function isValidEmail(email: string): boolean {
  return regex.email.test(email);
}

export const typeGuards: TypeGuards = {
  isValidEmail
} as const;
