// File: frontend/src/app/services/dom/LayoutManager.ts

import type { LayoutManagerContract, ResizePlugin } from '../meta/index.js';
import { ErrorHandler } from './ErrorHandler.js';

export class LayoutManager implements LayoutManagerContract {
  static #instance: LayoutManager | null = null;

  // #debounceTimeout: number | null = null;
  #plugins: Set<ResizePlugin> = new Set();

  #errors: ErrorHandler;

  private constructor(errors: ErrorHandler) {
    try {
      console.debug('Initializing LayoutManager...');

      this.#errors = errors;

      this.initialize();

      console.debug('LayoutManager initialized successfully.');
    } catch (error) {
      throw new Error(
        `Failed to initialize LayoutManager: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  static getInstance(errors: ErrorHandler): LayoutManager {
    try {
      if (!LayoutManager.#instance) {
        console.debug(
          'No LayoutManager instance exists yet. Creating new instance.'
        );
        LayoutManager.#instance = new LayoutManager(errors);
        console.debug(`Returning LayoutManager instance created.`);
      }

      return LayoutManager.#instance;
    } catch (error) {
      throw new Error(
        `Failed to get LayoutManager instance: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  initialize(): void {
    this.#errors.handleSync(() => {
      console.debug('Registering Window Resize event listeners...');

      // window.addEventListener('resize', this.debouncedRunAll);
      document.addEventListener('DOMContentLoaded', this.runAll.bind(this));
    }, 'LayoutManager initialization failed.');
  }

  register(plugin: ResizePlugin): void {
    return this.#errors.handleSync(() => {
      console.debug(`Registering LayoutManager plugin: ${plugin.name}`);
      this.#plugins.add(plugin);
    }, 'LayoutManager plugin registration failed.');
  }

  runAll(): void {
    console.debug(`Running all registered layout plugins...`);

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

  unregister(plugin: ResizePlugin): void {
    this.#plugins.delete(plugin);
  }
}
