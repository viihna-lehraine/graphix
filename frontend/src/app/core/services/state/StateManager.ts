// File: frontend/src/app/core/services/state/StateManager.ts

import type {
  CanvasState,
  ClientState,
  Data,
  GifAnimation,
  Layer,
  Services,
  State,
  StateLifecycleHook,
  StateManagerContract,
  Subscriber,
  TextLayerElement,
  Utilities
} from '../../../types/index.js';
import { CanvasStateService, ClientStateService } from '../index.js';

// ======================================================== //
// ======================================================== //

export class StateManager implements StateManagerContract {
  static #instance: StateManager | null = null;

  #version: string | null = null;
  #lifecycleHooks: StateLifecycleHook[] = [];

  #canvas: CanvasStateService;
  #client: ClientStateService;

  #data: Data;
  #errors: Services['errors'];
  #log: Services['log'];
  #utils: Utilities;

  // ================================================= //

  private constructor(
    data: Data,
    errors: Services['errors'],
    log: Services['log'],
    utils: Utilities
  ) {
    try {
      log.info('Initializing StateManager...', '[StateManager constructor]');

      this.#data = data;
      this.#errors = errors;
      this.#log = log;
      this.#utils = utils;

      this.#version = data.version;

      // hydrate state
      let initialState: State = {
        version: this.#data.version,
        canvas: {
          width: this.#data.config.defaults.canvasWidth,
          height: this.#data.config.defaults.canvasHeight,
          layers: [],
          selectedLayerIndex: null
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

          if (Array.isArray(initialState.canvas.layers)) {
            initialState.canvas.layers.forEach(layer => {
              if (!Array.isArray(layer.elements)) {
                layer.elements = [];
              }
            });
          }

          log.info(
            `StateManager hydrated from localStorage.`,
            '[StateManager constructor]'
          );
        } catch (error) {
          log.warn(
            'Failed to parse localStorage state. Using default values.',
            '[StateManager constructor]'
          );
        }
      }

      this.#canvas = CanvasStateService.getInstance(
        initialState.canvas,
        this.#data,
        this.#log,
        this.#utils
      );
      this.#client = ClientStateService.getInstance(initialState.client);

      this.#canvas.subscribe(() => this.#persistToStorage());
      this.#client.subscribe(() => this.#persistToStorage());

      log.info(
        'StateManager initialized successfully.',
        '[StateManager constructor]'
      );
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
    log: Services['log'],
    utils: Utilities
  ): StateManager {
    try {
      log.info('Calling StateManager.getInstance()...');

      if (!StateManager.#instance) {
        log.info(
          'No existing StateManager instance found. Creating new instance.'
        );
        return (StateManager.#instance = new StateManager(
          data,
          errors,
          log,
          utils
        ));
      }

      log.info('Returning existing StateManager instance.');
      return StateManager.#instance;
    } catch (error) {
      throw new Error(
        `Failed to get StateManager instance: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  // ================================================= //
  // CORE CLASS METHODS //

  addLifecycleHook(hook: StateLifecycleHook): void {
    this.#errors.handleSync(() => {
      this.#log.info(
        'Adding lifecycle hook.',
        'StateManager.addLifecycleHook()'
      );

      if (typeof hook !== 'function') {
        throw new Error('Lifecycle hook must be a function.');
      }

      this.#lifecycleHooks.push(hook);
      this.#log.info(
        'Lifecycle hook added successfully.',
        'StateManager.addLifecycleHook()'
      );
    }, 'Failed to add lifecycle hook.');
  }

  getState(): State {
    return this.#errors.handleSync(() => {
      this.#log.info('Returning current state.', 'StateManager.getState()');

      return {
        version: this.#version!,
        canvas: this.getCanvas(),
        client: this.getClient()
      };
    }, 'Failed to return state.');
  }

  // ================================================= //
  // PROXY CANVAS STATE ACCESS //

  addLayer(layer: Layer): void {
    this.#canvas.addLayer(layer);
    for (const hook of this.#lifecycleHooks) {
      hook('addLayer', this.getCanvas());
    }
  }
  addTextElement(elem: TextLayerElement): void {
    this.#canvas.addTextElement(elem);
  }
  canRedoCanvas(): boolean {
    return this.#canvas.canRedo();
  }
  canUndoCanvas(): boolean {
    return this.#canvas.canUndo();
  }
  clearCanvasAll(): void {
    this.#canvas.clearAll();
    window.localStorage.setItem('appState', JSON.stringify(this.getState()));
  }
  clearCanvasAnimation(): void {
    this.#canvas.clearAnimation();
  }
  getCanvas(): CanvasState {
    return this.#canvas.get();
  }
  getCanvasAspectRatio(): number | undefined {
    return this.#canvas.getAspectRatio();
  }
  moveLayer(index: number, newIndex: number): void {
    this.#canvas.moveLayer(index, newIndex);
  }
  moveTextElement(
    layerIndex: number,
    elemIndex: number,
    x: number,
    y: number
  ): void {
    this.#canvas.moveTextElement(layerIndex, elemIndex, x, y);
  }
  redoCanvas(): void {
    this.#canvas.redo();
  }
  removeLayer(index: number): void {
    this.#canvas.removeLayer(index);
  }
  removeTextElement(layerIndex: number, elemIndex: number): void {
    this.#canvas.removeTextElement(layerIndex, elemIndex);
  }
  resetCanvas(): void {
    this.#canvas.reset();
  }
  setCanvas(width: number, height: number): void {
    this.#canvas.set(width, height);
  }
  setCanvasAnimation(anim: GifAnimation | null): void {
    this.#canvas.setAnimation(anim);
  }
  setCanvasAspectRatio(aspect: number | undefined): void {
    this.#canvas.setAspectRatio(aspect);
  }
  setCanvasImage(imageDataUrl: string | undefined): void {
    this.#canvas.setCanvasImage(imageDataUrl);
  }
  setSelectedLayerIndex(index: number | null): void {
    this.#canvas.setSelectedLayerIndex(index);
  }
  subscribeToCanvas(fn: Subscriber<CanvasState>): () => void {
    return this.#canvas.subscribe(fn);
  }
  undoCanvas(): void {
    this.#canvas.undo();
  }
  updateLayer(index: number, newLayer: Layer): void {
    this.#canvas.updateLayer(index, newLayer);
  }
  updateTextElement(index: number, newElem: TextLayerElement): void {
    this.#canvas.updateTextElement(index, newElem);
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
  // PRIVATE METHODS //

  #persistToStorage(): void {
    return this.#errors.handleSync(() => {
      window.localStorage.setItem('appState', JSON.stringify(this.getState()));
    }, 'Failed to persist state to localStorage.');
  }
}
