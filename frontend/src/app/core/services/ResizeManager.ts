// File: frontend/src/app/core/services/dom/ResizeManager.ts

import type {
  ResizeManagerContract,
  ResizePlugin,
  Services
} from '../../types/index.js';

// =================================================== //
// =================================================== //

export class ResizeManager implements ResizeManagerContract {
  static #instance: ResizeManager | null = null;

  // #debounceTimeout: number | null = null;
  #plugins: Set<ResizePlugin> = new Set();

  #errors: Services['errors'];

  // =================================================== //

  private constructor(errors: Services['errors']) {
    try {
      console.debug('Initializing ResizeManager...');

      this.#errors = errors;

      this.initialize();

      console.debug('ResizeManager initialized successfully.');
    } catch (error) {
      throw new Error(
        `Failed to initialize ResizeManager: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  // =================================================== //

  static getInstance(errors: Services['errors']): ResizeManager {
    try {
      if (!ResizeManager.#instance) {
        console.debug(
          'No ResizeManager instance exists yet. Creating new instance.'
        );
        ResizeManager.#instance = new ResizeManager(errors);
        console.debug(`Returning ResizeManager instance created.`);
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
      console.debug('Registering Window Resize event listeners...');

      // window.addEventListener('resize', this.debouncedRunAll);
      document.addEventListener('DOMContentLoaded', this.runAll.bind(this));
    }, 'ResizeManager initialization failed.');
  }

  // =================================================== //

  register(plugin: ResizePlugin): void {
    return this.#errors.handleSync(() => {
      console.debug(`Registering ResizeManager plugin: ${plugin.name}`);
      this.#plugins.add(plugin);
    }, 'ResizeManager plugin registration failed.');
  }

  // =================================================== //

  runAll(): void {
    console.debug(`Running all registered resize plugins...`);

    this.#plugins.forEach(fn => {
      try {
        fn();
      } catch (error) {
        console.error(
          `Plugin error: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    });
  }

  // =================================================== //

  unregister(plugin: ResizePlugin): void {
    this.#plugins.delete(plugin);
  }
}
