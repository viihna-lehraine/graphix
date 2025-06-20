// File: frontend/src/app/core/services/state/UIStateService.ts

import type {
  Subscriber,
  UIState,
  UIStateServiceContract
} from '../../../types/index.js';

export class UIStateService implements UIStateServiceContract {
  static #instance: UIStateService | null = null;

  #uiState: UIState;
  #subscribers: Set<Subscriber<UIState>> = new Set();

  private constructor(initial: UIState) {
    this.#uiState = { ...initial };
  }

  static getInstance(initial: UIState): UIStateService {
    if (!UIStateService.#instance) {
      UIStateService.#instance = new UIStateService(initial);
    }
    return UIStateService.#instance;
  }

  get(): UIState {
    return { ...this.#uiState };
  }

  set<K extends keyof UIState>(key: K, value: UIState[K]): void {
    this.#uiState[key] = value;
    this.#notify();
  }

  subscribe(fn: Subscriber<UIState>): () => void {
    this.#subscribers.add(fn);
    fn(this.get());
    return () => this.#subscribers.delete(fn);
  }

  #notify() {
    const state = this.get();
    for (const fn of this.#subscribers) fn(state);
  }
}
