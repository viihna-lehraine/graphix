// File: frontend/src/app/core/services/state/StateManager.ts

import type {
  CanvasState,
  ClientState,
  Data,
  EnvVars,
  GifAnimation,
  Helpers,
  Layer,
  LayerElement,
  State,
  StateLifecycleHook,
  StateManagerContract,
  Subscriber,
  TextLayerElement,
  Utilities
} from '../../../types/index.js';
import { CanvasStateService } from './CanvasStateService.js';
import { ClientStateService } from './ClientStateService.js';
import { ErrorHandler } from '../ErrorHandler.js';
import { LayerManager } from '@engine/LayerManager.js';

export class StateManager implements StateManagerContract {
  static #instance: StateManager | null = null;

  #version: string | null = null;
  #lifecycleHooks: StateLifecycleHook[] = [];

  #canvas: CanvasStateService;
  #client: ClientStateService;
  #layerManager: LayerManager;

  #data: Data;
  #env: EnvVars;
  #errors: ErrorHandler;
  #helpers: Helpers;
  #utils: Utilities;

  private constructor(
    data: Data,
    env: EnvVars,
    errors: ErrorHandler,
    helpers: Helpers,
    utils: Utilities
  ) {
    try {
      console.debug('Initializing StateManager...');

      this.#data = data;
      this.#env = env;
      this.#errors = errors;
      this.#helpers = helpers;
      this.#utils = utils;

      this.#version = this.#env.VERSION;

      // hydrate state
      let initialState: State = {
        version: this.#env.VERSION,
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
          console.debug(`StateManager hydrated from localStorage.`);
        } catch (error) {
          console.warn(
            'Failed to parse localStorage state. Using default values.'
          );
        }
      }

      this.#canvas = CanvasStateService.getInstance(
        initialState.canvas,
        this.#data,
        this.#utils
      );
      this.#client = ClientStateService.getInstance(initialState.client);
      this.#layerManager = LayerManager.getInstance(this.#helpers);

      this.#canvas.subscribe(() => this.#persistToStorage());
      this.#client.subscribe(() => this.#persistToStorage());

      console.info('StateManager initialized successfully.');
    } catch (error) {
      throw new Error(
        `Failed to initialize StateManager: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  static getInstance(
    data: Data,
    env: EnvVars,
    errors: ErrorHandler,
    helpers: Helpers,
    utils: Utilities
  ): StateManager {
    try {
      console.debug('Calling StateManager.getInstance()...');

      if (!StateManager.#instance) {
        console.debug(
          'No existing StateManager instance found. Creating new instance.'
        );
        return (StateManager.#instance = new StateManager(
          data,
          env,
          errors,
          helpers,
          utils
        ));
      }

      console.debug('Returning existing StateManager instance.');
      return StateManager.#instance;
    } catch (error) {
      throw new Error(
        `Failed to get StateManager instance: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  // ====================================================================

  addLifecycleHook(hook: StateLifecycleHook): void {
    this.#errors.handleSync(() => {
      console.debug('Adding lifecycle hook.');

      if (typeof hook !== 'function') {
        throw new Error('Lifecycle hook must be a function.');
      }

      this.#lifecycleHooks.push(hook);
      console.debug('Lifecycle hook added successfully.');
    }, 'Failed to add lifecycle hook.');
  }

  getState(): State {
    return this.#errors.handleSync(() => {
      console.debug('Returning current state.');

      return {
        version: this.#version!,
        canvas: this.getCanvas(),
        client: this.getClient()
      };
    }, 'Failed to return state.');
  }

  // ====================================================================

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
  redoCanvas(): void {
    this.#canvas.redo();
  }
  removeLayer(index: number): void {
    this.#canvas.removeLayer(index);
  }
  removeTextElement(layerIndex: number): void {
    this.#canvas.removeTextElement(layerIndex);
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
  updateTextElement(index: number): void {
    this.#canvas.updateTextElement(index);
  }

  // ====================================================================

  getClient(): ClientState {
    return this.#client.get();
  }
  setClient(viewportWidth: number, viewportHeight: number): void {
    this.#client.set(viewportWidth, viewportHeight);
  }
  subscribeToClient(fn: Subscriber<ClientState>): () => void {
    return this.#client.subscribe(fn);
  }

  // ====================================================================

  moveLayerById(layerId: string, newIndex: number): void {
    const layers = this.getCanvas().layers;
    const index = layers.findIndex(l => l.id === layerId);
    if (index !== -1) {
      this.moveLayer(index, newIndex);
    } else {
      throw new Error(`Layer with id ${layerId} not found`);
    }
  }

  removeElementById(elementId: string): void {
    const layers = this.getCanvas().layers;
    const index = layers.findIndex(l => l.element.id === elementId);
    if (index !== -1) {
      this.removeLayer(index);
    } else {
      throw new Error(`Element with id ${elementId} not found`);
    }
  }

  removeLayerById(layerId: string): void {
    const layers = this.getCanvas().layers;
    const index = layers.findIndex(l => l.id === layerId);

    if (index !== -1) {
      this.removeLayer(index);
    } else {
      throw new Error(`Layer with ID ${layerId} not found.`);
    }
  }

  updateElement(
    layerId: string,
    elementId: string,
    updatedElement: LayerElement
  ): void {
    const layers = this.getCanvas().layers;
    const index = layers.findIndex(l => l.id === layerId);

    if (index === -1) throw new Error(`Layer with id ${layerId} not found`);
    if (layers[index].element.id === elementId) {
      this.updateLayer(index, { ...layers[index], element: updatedElement });
    } else {
      throw new Error(
        `Element with id ${elementId} not found in layer ${layerId}`
      );
    }
  }

  // ====================================================================

  #persistToStorage(): void {
    return this.#errors.handleSync(() => {
      window.localStorage.setItem('appState', JSON.stringify(this.getState()));
    }, 'Failed to persist state to localStorage.');
  }

  // ====================================================================

  _(): void {
    this.#layerManager = this.#layerManager;
  }
}
