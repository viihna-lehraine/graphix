// File: frontend/src/app/state/CanvasStateService.ts

import type {
  CanvasState,
  CanvasStateServiceContract,
  Data,
  Subscriber
} from '../types/index.js';

// ================================================== //
// ================================================== //

export class CanvasStateService implements CanvasStateServiceContract {
  static #instance: CanvasStateService | null = null;

  #canvasState: CanvasState;
  #subscribers: Set<Subscriber<CanvasState>>;

  #history: CanvasState[];
  #future: CanvasState[];

  #data: Data;

  // ================================================= //

  private constructor(initial: CanvasState, data: Data) {
    this.#canvasState = { ...initial };
    this.#subscribers = new Set();
    this.#history = [];
    this.#future = [];
    this.#data = data;
  }

  // ================================================= //

  static getInstance(initial: CanvasState, data: Data): CanvasStateService {
    try {
      if (!CanvasStateService.#instance) {
        CanvasStateService.#instance = new CanvasStateService(initial, data);
      }

      return CanvasStateService.#instance;
    } catch (error) {
      throw new Error(
        `Failed to get CanvasStateService instance: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  // ================================================= //

  canRedo(): boolean {
    return this.#future.length > 0;
  }

  // ================================================= //

  canUndo(): boolean {
    return this.#history.length > 0;
  }

  // ================================================= //

  get(): CanvasState {
    return { ...this.#canvasState };
  }

  // ================================================= //

  redo(): void {
    if (this.#future.length > 0) {
      this.#history.push({ ...this.#canvasState });
      this.#canvasState = this.#future.pop()!;
      this.#notify();
    }
  }

  // ================================================= //

  reset() {
    this.set(
      this.#data.config.default.canvasWidth,
      this.#data.config.default.canvasHeight
    );
  }

  // ================================================= //

  set(width: number, height: number): void {
    this.#history.push({ ...this.#canvasState }); // save current state to history
    this.#future = []; // clear redo stack on new action
    this.#canvasState.width = width;
    this.#canvasState.height = height;
    this.#notify();
  }

  // ================================================= //

  subscribe(fn: Subscriber<CanvasState>) {
    this.#subscribers.add(fn);
    fn(this.get());
    return () => this.#subscribers.delete(fn);
  }

  // ================================================= //

  undo(): void {
    if (this.#history.length > 0) {
      this.#future.push({ ...this.#canvasState });
      this.#canvasState = this.#history.pop()!;
      this.#notify();
    }
  }

  // ================================================= //

  #notify() {
    const state = this.get();
    for (const fn of this.#subscribers) fn(state);
  }
}
