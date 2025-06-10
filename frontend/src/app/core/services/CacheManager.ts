// File: frontend/src/app/core/services/CanvasCacheService.ts

import type {
  Cache,
  CacheManagerContract,
  Services
} from '../../types/index.js';

// ======================================================== //
// ======================================================== //

export class CacheManager implements CacheManagerContract {
  static #instance: CacheManager | null = null;

  #cache = {} as Cache;

  #errors: Services['errors'];
  #log: Services['log'];

  // ====================================================== //

  private constructor(errors: Services['errors'], log: Services['log']) {
    try {
      this.#errors = errors;
      this.#log = log;

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

  // ====================================================== //

  public static getInstance(
    errors: Services['errors'],
    log: Services['log']
  ): CacheManager {
    return errors.handleSync(() => {
      if (!CacheManager.#instance) {
        log.info('Creating CanvasCacheService instance.');
        CacheManager.#instance = new CacheManager(errors, log);
      }

      log.info('Returning existing CanvasCacheService instance.');
      return CacheManager.#instance;
    }, 'Unhandled CanvasCacheService getInstance error.');
  }

  // ====================================================== //

  get cachedBgImg(): HTMLImageElement | null {
    return this.#errors.handleSync(() => {
      this.#log.debug('Returning cached canvas background img');
      return this.#cache.bgImg;
    }, 'Unhandled CanvasCacheService cachedBgImg getter error.');
  }

  set cachedBgImg(img: HTMLImageElement | null) {
    this.#errors.handleSync(() => {
      this.#cache.bgImg = img;
    }, 'Unhandled CanvasCacheService cachedBgImg setter error.');
  }

  // ====================================================== //

  clearAll(): void {
    this.#errors.handleSync(() => {
      this.#cache.bgImg = null;
    }, 'Unhandled CanvasCacheService clearAll error.');
  }
}
