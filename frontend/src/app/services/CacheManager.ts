// File: frontend/src/app/services/CanvasCacheService.ts

import type { Cache, CacheManagerContract } from '@index';
import { ErrorHandler } from '@index';

export class CacheManager implements CacheManagerContract {
  static #instance: CacheManager | null = null;

  #cache = {} as Cache;
  #errors: ErrorHandler;

  private constructor(errors: ErrorHandler) {
    try {
      this.#errors = errors;

      if (CacheManager.#instance) {
        throw new Error(
          'CanvasCacheService is a singleton and cannot be instantiated multiple times.'
        );
      }

      CacheManager.#instance = this;
    } catch (error) {
      throw new Error('Unhandled CanvasCacheService initialization error.');
    }
  }

  public static getInstance(errors: ErrorHandler): CacheManager {
    return errors.handleSync(() => {
      if (!CacheManager.#instance) {
        console.debug('Creating CanvasCacheService instance.');
        CacheManager.#instance = new CacheManager(errors);

        return CacheManager.#instance;
      }

      console.debug('Returning existing CanvasCacheService instance.');
      return CacheManager.#instance;
    }, 'Unhandled CanvasCacheService getInstance error.');
  }

  get cachedBgImg(): HTMLImageElement | null {
    return this.#errors.handleSync(() => {
      console.debug('Returning cached canvas background img');
      return this.#cache.bgImg;
    }, 'Unhandled CanvasCacheService cachedBgImg getter error.');
  }

  set cachedBgImg(img: HTMLImageElement | null) {
    this.#errors.handleSync(() => {
      this.#cache.bgImg = img;
    }, 'Unhandled CanvasCacheService cachedBgImg setter error.');
  }

  clearAll(): void {
    this.#errors.handleSync(() => {
      this.#cache.bgImg = null;
    }, 'Unhandled CanvasCacheService clearAll error.');
  }
}
