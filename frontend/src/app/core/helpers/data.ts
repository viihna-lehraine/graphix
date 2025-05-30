// File: frontend/src/app/core/helpers/data.ts

import type { DataHelpers } from '../../types/index.js';

// ================================================== //
// ================================================== //

export const dataHelperFactory = (): DataHelpers => ({
  clone<T>(data: T): T {
    return structuredClone(data);
  }
});
