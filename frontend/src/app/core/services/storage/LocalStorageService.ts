// File: frontend/src/app/core/services/storage/LocalStorageService.ts

import type { IStorageService } from '../../../types/index.js';

// ========================================================= //
// ========================================================= //

export class LocalStorageService implements IStorageService {
  get<T>(key: string): Promise<T | null> {
    return Promise.resolve(
      localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)!) : null
    );
  }

  set<T>(key: string, value: T): Promise<void> {
    localStorage.setItem(key, JSON.stringify(value));
    return Promise.resolve();
  }

  remove(key: string): Promise<void> {
    localStorage.removeItem(key);
    return Promise.resolve();
  }

  clear(): Promise<void> {
    localStorage.clear();
    return Promise.resolve();
  }
}
