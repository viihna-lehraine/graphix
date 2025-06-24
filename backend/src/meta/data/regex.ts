// File: backend/src/meta/data/regex.ts

import type { RegexData } from '../index.js';

const email: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const regex: RegexData = {
  email
} as const;
