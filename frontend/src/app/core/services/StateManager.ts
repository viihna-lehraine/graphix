// File: frontend/src/app/core/StateManager.ts

import type {
  CanvasState,
  Helpers,
  Services,
  State,
  StateManagerContract,
  Subscriber
} from '../../types/index.js';

// ================================================== //
// ================================================== //

export class StateManager implements StateManagerContract {
  static #instance: StateManager | null = null;

  #errors: Services['errors'];
  #helpers: Helpers;
  #log: Services['log'];
  #state: State;
  #subscribers: {
    canvas: Set<Subscriber<CanvasState>>;
  };

  // -------------------------------------------------- //

  private constructor(
    errors: Services['errors'],
    helpers: Helpers,
    log: Services['log']
  ) {
    try {
      log.info('Initializing StateManager...');

      this.#errors = errors;
      this.#helpers = helpers;
      this.#log = log;

      this.#state = {
        canvas: {
          width: 800,
          height: 600
        }
      };

      this.#subscribers = { canvas: new Set() };

      const saved = window.localStorage.getItem('appState');

      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          this.#state = {
            ...this.#state,
            ...parsed
          };

          log.info(`StateManager hydrated from localStorage.`);
        } catch (error) {
          log.warn(
            `Failed to parse localStorage appState. Using defaults. Details: ${error instanceof Error ? error.message : String(error)}`
          );
        }
      }

      log.info('StateManager initialized successfully.');
    } catch (error) {
      throw new Error(
        `Failed to initialize StateManager: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  // -------------------------------------------------- //

  static getInstance(
    errors: Services['errors'],
    helpers: Helpers,
    log: Services['log']
  ): StateManager {
    try {
      if (!StateManager.#instance) {
        StateManager.#instance = new StateManager(errors, helpers, log);
      }

      return StateManager.#instance;
    } catch (error) {
      throw new Error(
        `Failed to get StateManager instance: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  // -------------------------------------------------- //

  getAll(): State {
    return this.#helpers.data.clone(this.#state);
  }

  // -------------------------------------------------- //

  getCanvas(): CanvasState {
    return { ...this.#state.canvas };
  }

  // -------------------------------------------------- //

  resetCanvas(): void {
    this.#state.canvas = { width: 800, height: 600 };
  }

  // -------------------------------------------------- //

  setCanvas(width: number, height: number): void {
    this.#state.canvas.width = width;
    this.#state.canvas.height = height;
    this.#notifyCanvasSubscribers();
    this.#persistToStorage();
  }

  // -------------------------------------------------- //

  subscribeToCanvas(fn: Subscriber<CanvasState>): () => void {
    this.#subscribers.canvas.add(fn);
    fn(this.getCanvas());

    return () => this.#subscribers.canvas.delete(fn);
  }

  // ================================================== //

  #notifyCanvasSubscribers(): void {
    const state = this.getCanvas();

    for (const fn of this.#subscribers.canvas) fn(state);
  }

  // -------------------------------------------------- //

  #persistToStorage(): void {
    try {
      window.localStorage.setItem(
        'appState',
        JSON.stringify(this.#helpers.data.clone(this.#state))
      );
    } catch (error) {
      this.#log.warn(`Failed to persist app state to localStorage`);
    }
  }

  // ================================================== //
  // ================================================== //

  // TODO: remove later - suppresses TS warning about unused private fields
  _(): void {
    this.#log;
    this.#errors;
  }
}
