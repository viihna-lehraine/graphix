// File: frontend/src/app/core/helpers/data.ts

import type { DataHelpers } from '../../types/index.js';

export const dataHelperFactory = async (): Promise<DataHelpers> => ({
  clone<T>(data: T): T {
    return structuredClone(data);
  },

  getFileSizeInKB(file: File | Blob): number {
    return Math.round(file.size / 1024);
  },

  async getFileSHA256(file: File | Blob): Promise<string> {
    const buf = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buf);
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
});
