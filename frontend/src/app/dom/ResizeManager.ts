// File: frontend/rc/app/dom/ResizeManager.ts

import type {
  ResizeManagerContract,
  ResizePlugin,
  Services
} from '../types/index.js';

// =================================================== //
// =================================================== //

export class ResizeManager implements ResizeManagerContract {
  static #instance: ResizeManager | null = null;

  // #debounceTimeout: number | null = null;
  #plugins: Set<ResizePlugin> = new Set();

  #errors: Services['errors'];
  #log: Services['log'];

  // =================================================== //

  private constructor(services: Services) {
    try {
      const { log } = services;

      log.info('Initializing ResizeManager...');

      this.#errors = services.errors;
      this.#log = log;

      this.initialize();

      log.info('ResizeManager initialized successfully.');
    } catch (error) {
      throw new Error(
        `Failed to initialize ResizeManager: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  // =================================================== //

  static getInstance(services: Services): ResizeManager {
    try {
      if (!ResizeManager.#instance) {
        ResizeManager.#instance = new ResizeManager(services);
      }

      return ResizeManager.#instance;
    } catch (error) {
      throw new Error(
        `Failed to get ResizeManager instance: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  // =================================================== //

  initialize(): void {
    this.#errors.handleSync(() => {
      this.#log.info('Registering Window Resize event listeners...');

      // window.addEventListener('resize', this.debouncedRunAll);
      document.addEventListener('DOMContentLoaded', this.runAll.bind(this));
    }, 'ResizeManager initialization failed.');
  }

  // =================================================== //

  register(plugin: ResizePlugin): void {
    this.#plugins.add(plugin);
  }

  // =================================================== //

  runAll(): void {
    this.#plugins.forEach(fn => {
      try {
        fn();
      } catch (err) {
        console.error('[ResizeManager] Plugin error:', err);
      }
    });
  }

  // =================================================== //

  unregister(plugin: ResizePlugin): void {
    this.#plugins.delete(plugin);
  }
}
