// File: frontend/src/app/state/StateManager.ts

import type {
  CanvasState,
  ClientState,
  Data,
  Services,
  State,
  StateManagerContract,
  Subscriber
} from '../types/index.js';
import { CanvasStateService } from './CanvasStateService.js';
import { ClientStateService } from './ClientStateService.js';

// ================================================== //
// ================================================== //

export class StateManager implements StateManagerContract {
  static #instance: StateManager | null = null;

  #canvas: CanvasStateService;
  #client: ClientStateService;

  #errors: Services['errors'];
  #log: Services['log'];

  #data: Data;

  // ================================================= //

  private constructor(
    data: Data,
    errors: Services['errors'],
    log: Services['log']
  ) {
    try {
      log.info('Initializing StateManager...');

      this.#data = data;
      this.#errors = errors;
      this.#log = log;

      // hydrate state
      let initialState: State = {
        canvas: {
          width: this.#data.config.default.canvasWidth,
          height: this.#data.config.default.canvasHeight
        },
        client: {
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight
        }
      };

      const saved = window.localStorage.getItem('appState');

      if (saved) {
        try {
          Object.assign(initialState, JSON.parse(saved));
          log.info(`StateManager hydrated from localStorage.`);
        } catch (error) {
          log.warn('Failed to parse localStorage state. Using default values.');
        }
      }

      this.#canvas = CanvasStateService.getInstance(
        initialState.canvas,
        this.#data
      );
      this.#client = ClientStateService.getInstance(initialState.client);

      this.#canvas.subscribe(() => this.#persistToStorage());
      this.#client.subscribe(() => this.#persistToStorage());

      log.info('StateManager initialized successfully.');
    } catch (error) {
      throw new Error(
        `Failed to initialize StateManager: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  // ================================================== //

  static getInstance(
    data: Data,
    errors: Services['errors'],
    log: Services['log']
  ): StateManager {
    try {
      if (!StateManager.#instance) {
        StateManager.#instance = new StateManager(data, errors, log);
      }

      return StateManager.#instance;
    } catch (error) {
      throw new Error(
        `Failed to get StateManager instance: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  // ================================================= //
  // PROXY CANVAS STATE ACCESS //

  canRedoCanvas(): boolean {
    return this.#canvas.canRedo();
  }

  canUndoCanvas(): boolean {
    return this.#canvas.canUndo();
  }

  getCanvas(): CanvasState {
    return this.#canvas.get();
  }

  resetCanvas(): void {
    this.#canvas.reset();
  }

  setCanvas(width: number, height: number): void {
    this.#canvas.set(width, height);
  }
  subscribeToCanvas(fn: Subscriber<CanvasState>): () => void {
    return this.#canvas.subscribe(fn);
  }

  redoCanvas(): void {
    this.#canvas.redo();
  }

  undoCanvas(): void {
    this.#canvas.undo();
  }

  // ================================================= //
  // PROXY CLIENT STATE ACCESS //

  getClient(): ClientState {
    return this.#client.get();
  }
  setClient(viewportWidth: number, viewportHeight: number): void {
    this.#client.set(viewportWidth, viewportHeight);
  }
  subscribeToClient(fn: Subscriber<ClientState>): () => void {
    return this.#client.subscribe(fn);
  }

  // ================================================= //

  getAll(): State {
    return {
      canvas: this.getCanvas(),
      client: this.getClient()
    };
  }

  // ================================================= //

  #persistToStorage(): void {
    try {
      window.localStorage.setItem('appState', JSON.stringify(this.getAll()));
    } catch (error) {
      this.#log.warn(`Failed to persist app state to localStorage`);
    }
  }

  // ================================================= //
  // ================================================= //

  // TODO: remove later - suppresses TS warning about unused private fields
  _(): void {
    this.#log;
    this.#errors;
  }
}
