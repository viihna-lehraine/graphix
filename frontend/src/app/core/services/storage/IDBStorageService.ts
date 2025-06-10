// File: frotnend/src/app/core/services/storage/IDBStorageService.ts

import type { IStorageService } from '../../../types/index.js';

export class IDBStorageService implements IStorageService {
  static DB_NAME = 'graphix-app';
  static STORE = 'app-data';

  #db: IDBDatabase;

  private constructor(db: IDBDatabase) {
    this.#db = db;
  }

  // ======================================================= //

  static create(): Promise<IDBStorageService> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(IDBStorageService.DB_NAME, 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(IDBStorageService.STORE)) {
          db.createObjectStore(IDBStorageService.STORE);
        }
      };
      request.onsuccess = () => {
        resolve(new IDBStorageService(request.result));
      };
      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  // ======================================================= //

  clear(): Promise<void> {
    return new Promise((resolve, reject) => {
      const req = this.#tx('readwrite').clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  get<T>(key: string): Promise<T | null> {
    return new Promise((resolve, reject) => {
      const req = this.#tx('readonly').get(key);
      req.onsuccess = () => resolve(req.result ? JSON.parse(req.result) : null);
      req.onerror = () => reject(req.error);
    });
  }

  remove(key: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const req = this.#tx('readwrite').delete(key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  set<T>(key: string, value: T): Promise<void> {
    return new Promise((resolve, reject) => {
      const req = this.#tx('readwrite').put(JSON.stringify(value), key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  // ======================================================= //

  #tx(mode: IDBTransactionMode): IDBObjectStore {
    return this.#db
      .transaction(IDBStorageService.STORE, mode)
      .objectStore(IDBStorageService.STORE);
  }
}
