// File: frontend/src/app/core/data/base.ts

import type { BaseData } from '../types/index.js';

const version = '0.0.1' as const;

export const baseData: BaseData = {
  version
} as const;
