// File: frontend/src/app/core/services/state/StateManager.ts

import type {
  CanvasState,
  ClientState,
  Data,
  EnvVars,
  GifAnimation,
  Layer,
  LayerElement,
  State,
  StateLifecycleHook,
  StateManagerContract,
  Subscriber,
  TextLayerElement,
  UIState
} from '../../../types/index.js';
import {
  CanvasStateService,
  ClientStateService,
  ErrorHandler,
  RenderingManager,
  UIStateService
} from '../../../types/index.js';

export class StateManager implements StateManagerContract {
  static #instance: StateManager | null = null;

  #version: string | null = null;
  #lifecycleHooks: StateLifecycleHook[] = [];

  #canvasStateService: CanvasStateService;
  #clientStateService: ClientStateService;
  #uiStateService: UIStateService = UIStateService.getInstance({
    uploadMode: null
  });

  #data: Data;
  #env: EnvVars;
  #errors: ErrorHandler;

  private constructor(data: Data, env: EnvVars, errors: ErrorHandler) {
    try {
      console.debug('Initializing StateManager...');

      this.#data = data;
      this.#env = env;
      this.#errors = errors;

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
        },
        ui: { uploadMode: null }
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

      this.#canvasStateService = CanvasStateService.getInstance(
        initialState.canvas,
        this.#data
      );
      this.#clientStateService = ClientStateService.getInstance(
        initialState.client
      );
      this.#uiStateService = UIStateService.getInstance(initialState.ui);

      this.#canvasStateService.subscribe(() => this.#persistToStorage());
      this.#clientStateService.subscribe(() => this.#persistToStorage());
      this.#uiStateService.subscribe(() => this.#persistToStorage());

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
    errors: ErrorHandler
  ): StateManager {
    try {
      console.debug('Calling StateManager.getInstance()...');

      if (!StateManager.#instance) {
        console.debug(
          'No existing StateManager instance found. Creating new instance.'
        );
        return (StateManager.#instance = new StateManager(data, env, errors));
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
        client: this.getClientState(),
        ui: this.getUIState()
      };
    }, 'Failed to return state.');
  }

  // ====================================================================

  addLayer(layer: Layer): void {
    this.#canvasStateService.addLayer(layer);
    for (const hook of this.#lifecycleHooks) {
      hook('addLayer', this.getCanvas());
    }
  }
  addTextElement(elem: TextLayerElement): void {
    this.#canvasStateService.addTextElement(elem);
  }
  canRedoCanvas(): boolean {
    return this.#canvasStateService.canRedo();
  }
  canUndoCanvas(): boolean {
    return this.#canvasStateService.canUndo();
  }
  clearCanvasAll(): void {
    this.#canvasStateService.clearAll();
    window.localStorage.setItem(
      this.#data.storage_keys.APP_STATE,
      JSON.stringify(this.getState())
    );
  }
  clearCanvasAnimation(): void {
    this.#canvasStateService.clearAnimation();
  }
  getCanvas(): CanvasState {
    return this.#canvasStateService.get();
  }
  getCanvasAspectRatio(): number | undefined {
    return this.#canvasStateService.getAspectRatio();
  }
  moveLayer(index: number, newIndex: number): void {
    this.#canvasStateService.moveLayer(index, newIndex);
  }
  redoCanvas(): void {
    this.#canvasStateService.redo();
  }
  removeLayer(index: number): void {
    this.#canvasStateService.removeLayer(index);
  }
  removeTextElement(layerIndex: number): void {
    this.#canvasStateService.removeTextElement(layerIndex);
  }
  resetCanvas(): void {
    this.#canvasStateService.reset();
  }
  setCanvas(width: number, height: number): void {
    this.#canvasStateService.set(width, height);
  }
  setCanvasAnimation(anim: GifAnimation | null): void {
    this.#canvasStateService.setAnimation(anim);
  }
  setCanvasAspectRatio(aspect: number | undefined): void {
    this.#canvasStateService.setAspectRatio(aspect);
  }
  setCanvasImage(
    imageDataUrl: string | undefined,
    renderingManager: RenderingManager
  ): void {
    const img = this.#canvasStateService.setCanvasImage(imageDataUrl);

    if (img) {
      img.onload = () => {
        const canvas = document.getElementById(
          this.#data.dom.ids.canvas
        ) as HTMLCanvasElement | null;
        if (!canvas) throw new Error('Canvas element not found');

        renderingManager.syncCanvasBackgroundFromImage(canvas, img);
      };
    }
  }
  setSelectedLayerIndex(index: number | null): void {
    this.#canvasStateService.setSelectedLayerIndex(index);
  }
  subscribeToCanvasState(fn: Subscriber<CanvasState>): () => void {
    return this.#canvasStateService.subscribe(fn);
  }
  undoCanvas(): void {
    this.#canvasStateService.undo();
  }
  updateLayer(index: number, newLayer: Layer): void {
    this.#canvasStateService.updateLayer(index, newLayer);
  }
  updateTextElement(index: number, renderingManager: RenderingManager): void {
    this.#canvasStateService.updateTextElement(index, renderingManager);
  }

  // ====================================================================

  getClientState(): ClientState {
    return this.#clientStateService.get();
  }
  setClientState(viewportWidth: number, viewportHeight: number): void {
    this.#clientStateService.set(viewportWidth, viewportHeight);
  }
  subscribeToClientState(fn: Subscriber<ClientState>): () => void {
    return this.#clientStateService.subscribe(fn);
  }

  // ====================================================================

  getUIState(): UIState {
    return this.#uiStateService.get();
  }

  setUIState<K extends keyof UIState>(key: K, value: UIState[K]): void {
    this.#uiStateService.set(key, value);
  }

  subscribeToUIState(fn: Subscriber<UIState>): () => void {
    return this.#uiStateService.subscribe(fn);
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
}
