// File: frontend/src/app/types/contracts.ts

import type {
  AnimationGroup,
  CanvasState,
  ClientState,
  ErrorHandlerOptions,
  GifAnimation,
  Layer,
  LayerElement,
  NotifierLevel,
  RedrawPlugin,
  ResizePlugin,
  State,
  StateLifecycleHook,
  Subscriber,
  TextLayerElement
} from './index.js';

// ================================================== //
// ================================================== //
// ================================================== //

export interface AnimationGroupManagerContract {
  addGroup: (group: AnimationGroup) => void;
  removeGroup: (groupId: string) => void;
  pause: (groupId: string) => void;
  play: (groupId: string) => void;
  update(deltaTime: number): void;
}

export interface CacheManagerContract {
  clearAll(): void;
}

export interface ErrorHandlerServiceContract {
  handleAndReturn<T>(
    action: () => T | Promise<T>,
    errorMessage: string,
    options?: ErrorHandlerOptions
  ): T | Promise<T>;
  handleAsync<T>(
    action: () => Promise<T>,
    errorMessage: string,
    options?: ErrorHandlerOptions
  ): Promise<T>;
  handleSync<T>(
    action: () => T,
    errorMessage: string,
    options?: ErrorHandlerOptions
  ): T;
}

export interface LayerManagerContract {
  addElementToLayer: (layerId: string, element: LayerElement) => void;
  addLayer: (layer: Layer) => void;
  getElementById(layerId: string, elementId: string): LayerElement | undefined;
  getLayerById(layerId: string): Layer | undefined;
  getLayers: () => Layer[];
  moveLayers(fromIndex: number, toIndex: number): void;
  removeElementFromLayer(layerId: string, elementId: string): void;
  removeLayer: (layerId: string) => void;
  subscribe(fn: () => void): () => void;
  updateElement: (
    layerId: string,
    elementId: string,
    updatedElement: LayerElement
  ) => void;
}

export interface LoggerServiceContract {
  debug: (message: string, caller?: string) => void;
  error: (message: string, caller?: string) => void;
  info: (message: string, caller?: string) => void;
  warn: (message: string, caller?: string) => void;
}

export interface NotifierServiceContract {
  notify: (message: string, level: NotifierLevel) => void;
  info: (message: string) => void;
  warn: (message: string) => void;
  error: (message: string) => void;
  success: (message: string) => void;
}

export interface ResizeManagerContract {
  initialize: () => void;
  register: (plugin: ResizePlugin) => void;
  runAll: () => void;
  unregister: (plugin: ResizePlugin) => void;
}

// ================================================== //
// ================================================== //
// ================================================== //

export interface StateManagerContract {
  addLayer: (layer: Layer) => void;
  addLifecycleHook: (hook: StateLifecycleHook) => void;
  addTextElement(elem: TextLayerElement): void;
  canRedoCanvas: () => boolean;
  canUndoCanvas: () => boolean;
  clearCanvasAll(): void;
  clearCanvasAnimation: () => void;
  getCanvas: () => CanvasState;
  getCanvasAspectRatio: () => number | undefined;
  getClient: () => ClientState;
  getState: () => State;
  moveLayer: (index: number, newIndex: number) => void;
  moveTextElement: (
    layerIndex: number,
    elemIndex: number,
    x: number,
    y: number
  ) => void;
  removeLayer: (index: number) => void;
  resetCanvas: () => void;
  setCanvas: (width: number, height: number) => void;
  setCanvasAnimation: (anim: GifAnimation | null) => void;
  setCanvasAspectRatio: (aspect: number) => void;
  setCanvasImage: (imageDataUrl: string | undefined) => void;
  setClient: (viewportWidth: number, viewportHeight: number) => void;
  setSelectedLayerIndex: (index: number | null) => void;
  subscribeToCanvas: (fn: Subscriber<CanvasState>) => () => void;
  subscribeToClient: (fn: Subscriber<ClientState>) => () => void;
  redoCanvas: () => void;
  undoCanvas: () => void;
  updateLayer: (index: number, newLayer: Layer) => void;
  updateTextElement: (index: number, newElem: TextLayerElement) => void;
}

export interface CanvasStateServiceContract {
  addLayer(layer: Layer): void;
  addTextElement: (elem: TextLayerElement) => void;
  canRedo: () => boolean;
  canUndo: () => boolean;
  clearAll: () => void;
  clearAnimation: () => void;
  get: () => CanvasState;
  getAspectRatio: () => number | undefined;
  getLayers(): Layer[];
  getSelectedLayerIndex(): number | null;
  moveLayer(index: number, newIndex: number): void;
  moveTextElement: (
    layerIndex: number,
    elemIndex: number,
    x: number,
    y: number
  ) => void;
  redo: () => void;
  removeLayer(index: number): void;
  removeTextElement(layerIndex: number, elemIndex: number): void;
  reset: () => void;
  set: (width: number, height: number) => void;
  setAnimation: (anim: GifAnimation) => void;
  setAspectRatio: (aspect: number) => void;
  setCanvasImage: (imageDataUrl: string | undefined) => void;
  setSelectedLayerIndex(index: number | null): void;
  subscribe: (fn: Subscriber<CanvasState>) => () => void;
  undo: () => void;
  updateLayer(index: number, newLayer: Layer): void;
  updateTextElement: (
    globalTextElemIndex: number,
    newElem: TextLayerElement
  ) => void;
}

export interface ClientStateServiceContract {
  get: () => ClientState;
  set: (viewportWidth: number, viewportHeight: number) => void;
  subscribe: (fn: Subscriber<ClientState>) => () => void;
}

// ================================================== //
// ================================================== //
// ================================================== //

export interface IStorageService {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
}

// ================================================== //
// ================================================== //
// ================================================== //

export interface RenderingEngineContract {
  addRedrawPlugin: (plugin: RedrawPlugin) => void;
  drawDevOverlay: () => void;
  render: (state?: CanvasState) => void;
  removeRedrawPlugin: (plugin: RedrawPlugin) => void;
  renderTo: (ctx: CanvasRenderingContext2D, state?: CanvasState) => void;
}
