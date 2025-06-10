// File: frontend/src/app/core/services/storage/StorageManager.ts

import type { IStorageService } from '../../../types/index.js';
import { IDBStorageService } from './IDBStorageService.js';
import { LocalStorageService } from './LocalStorageService.js';

// ================================================== //
// ================================================== //

export class StorageManager implements IStorageService {
  static #instance: StorageManager | null = null;

  #backend: IStorageService;

  private constructor(backend: IStorageService) {
    this.#backend = backend;
  }

  static async getInstance(): Promise<StorageManager> {
    if (!StorageManager.#instance) {
      // try IndexedDB, fallback to LocalStorage
      let backend: IStorageService;

      try {
        backend = await IDBStorageService.create();
      } catch (e) {
        backend = new LocalStorageService();
      }

      StorageManager.#instance = new StorageManager(backend);
    }
    return StorageManager.#instance;
  }

  // ================================================ //

  get<T>(key: string): Promise<T | null> {
    return this.#backend.get<T>(key);
  }

  set<T>(key: string, value: T): Promise<void> {
    return this.#backend.set<T>(key, value);
  }

  remove(key: string): Promise<void> {
    return this.#backend.remove(key);
  }

  clear(): Promise<void> {
    return this.#backend.clear();
  }
}
