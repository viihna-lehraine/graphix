// File: frontend/src/app/core/services/CanvasCacheService.ts

import type {
  CanvasCache,
  CanvasCacheServiceContract,
  Services
} from '../../types/index.js';

// ======================================================== //
// ======================================================== //

export class CanvasCacheService implements CanvasCacheServiceContract {
  static #instance: CanvasCacheService | null = null;

  #cache = {} as CanvasCache;

  #errors: Services['errors'];
  #log: Services['log'];

  // ====================================================== //

  private constructor(errors: Services['errors'], log: Services['log']) {
    try {
      this.#errors = errors;
      this.#log = log;

      if (CanvasCacheService.#instance) {
        throw new Error(
          'CanvasCacheService is a singleton and cannot be instantiated multiple times.'
        );
      }

      CanvasCacheService.#instance = this;
    } catch (error) {
      throw new Error('Unhandled CanvasCacheService initialization error.');
    }
  }

  // ====================================================== //

  public static getInstance(
    errors: Services['errors'],
    log: Services['log']
  ): CanvasCacheService {
    return errors.handleSync(() => {
      if (!CanvasCacheService.#instance) {
        log.info('Creating CanvasCacheService instance.');
        CanvasCacheService.#instance = new CanvasCacheService(errors, log);
      }

      log.info('Returning existing CanvasCacheService instance.');
      return CanvasCacheService.#instance;
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
