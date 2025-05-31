// File: frontend/src/app/state/ClientStateService.ts

import type {
  ClientState,
  ClientStateServiceContract,
  Subscriber
} from '../types/index.js';

// ================================================== //
// ================================================== //

export class ClientStateService implements ClientStateServiceContract {
  static #instance: ClientStateService | null = null;

  #state: ClientState;
  #subscribers: Set<Subscriber<ClientState>>;

  // ------------------------------------------------ //

  private constructor(initial: ClientState) {
    this.#state = { ...initial };
    this.#subscribers = new Set();
  }

  // ------------------------------------------------ //

  static getInstance(initial: ClientState): ClientStateService {
    try {
      if (!ClientStateService.#instance) {
        ClientStateService.#instance = new ClientStateService(initial);
      }

      return ClientStateService.#instance;
    } catch (error) {
      throw new Error(
        `Failed to get ClientStateService instance: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  // ------------------------------------------------ //

  get(): ClientState {
    return { ...this.#state };
  }

  // ------------------------------------------------ //

  set(viewportWidth: number, viewportHeight: number): void {
    this.#state.viewportWidth = viewportWidth;
    this.#state.viewportHeight = viewportHeight;
    this.#notify();
  }

  // ------------------------------------------------ //

  subscribe(fn: Subscriber<ClientState>) {
    this.#subscribers.add(fn);
    fn(this.get());
    return () => this.#subscribers.delete(fn);
  }

  // ------------------------------------------------ //

  #notify(): void {
    const state = this.get();

    for (const fn of this.#subscribers) fn(state);
  }
}
