// File: frontend/src/app/core/services/state/CanvasStateService.ts

import type {
  CanvasState,
  CanvasStateServiceContract,
  Data,
  Subscriber,
  TextElement
} from '../../../types/index.js';

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
    this.#canvasState.textElements = initial.textElements || [];
    this.#canvasState.selectedTextIndex = initial.selectedTextIndex ?? null;

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

  addTextElement(elem: TextElement): void {
    this.#canvasState.textElements.push(elem);
    this.#notify();
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

  clearAll(): void {
    this.#canvasState.textElements = [];
    this.#canvasState.selectedTextIndex = null;

    this.#notify();
  }

  // ================================================= //

  moveTextElement(index: number, x: number, y: number): void {
    const elem = this.#canvasState.textElements[index];

    if (elem) {
      elem.x = x;
      elem.y = y;
      this.#notify();
    }
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

  removeTextElement(index: number): void {
    this.#canvasState.textElements.splice(index, 1);
    this.#notify();
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

  setSelectedTextIndex(index: number | null): void {
    this.#canvasState.selectedTextIndex = index;
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

  updateTextElement(index: number, newElem: TextElement): void {
    this.#canvasState.textElements[index] = newElem;
    this.#notify();
  }

  // ================================================= //

  #notify(): void {
    const state = this.get();
    for (const fn of this.#subscribers) fn(state);
  }
}
