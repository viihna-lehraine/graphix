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
  TextLayerElement,
  UIState
} from './index.js';
import { RenderingManager } from '@engine/RenderingManager.js';

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

export interface LayerServiceContract {
  createImageLayer: (src: string, file: File) => Promise<Layer>;
  getElementById: (
    layers: Layer[],
    elementId: string
  ) => LayerElement | undefined;
  getLayerById: (layer: Layer[], layerId: string) => Layer | undefined;
}

export interface LayoutManagerContract {
  initialize: () => void;
  register: (plugin: ResizePlugin) => void;
  runAll: () => void;
  unregister: (plugin: ResizePlugin) => void;
}

export interface NotifierServiceContract {
  notify: (message: string, level: NotifierLevel) => void;
  info: (message: string) => void;
  warn: (message: string) => void;
  error: (message: string) => void;
  success: (message: string) => void;
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
  getClientState: () => ClientState;
  getState: () => State;
  getUIState: () => UIState;
  moveLayer: (index: number, newIndex: number) => void;
  removeLayer: (index: number) => void;
  removeTextElement(layerIndex: number): void;
  resetCanvas: () => void;
  setCanvas: (width: number, height: number) => void;
  setCanvasAnimation: (anim: GifAnimation | null) => void;
  setCanvasAspectRatio: (aspect: number) => void;
  setCanvasImage: (
    imageDataUrl: string | undefined,
    renderingManager: RenderingManager
  ) => void;
  setClientState: (viewportWidth: number, viewportHeight: number) => void;
  setSelectedLayerIndex: (index: number | null) => void;
  setUIState: <K extends keyof UIState>(key: K, value: UIState[K]) => void;
  subscribeToCanvasState: (fn: Subscriber<CanvasState>) => () => void;
  subscribeToClientState: (fn: Subscriber<ClientState>) => () => void;
  subscribeToUIState: (fn: Subscriber<UIState>) => () => void;
  redoCanvas: () => void;
  undoCanvas: () => void;
  updateLayer: (index: number, newLayer: Layer) => void;
  updateTextElement: (
    index: number,
    renderingManager: RenderingManager
  ) => void;
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
  moveTextLayer: (
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
    renderingManager: RenderingManager
  ) => void;
}

export interface ClientStateServiceContract {
  get: () => ClientState;
  set: (viewportWidth: number, viewportHeight: number) => void;
  subscribe: (fn: Subscriber<ClientState>) => () => void;
}

export interface UIStateServiceContract {
  get: () => UIState;
  set: <K extends keyof UIState>(key: K, value: UIState[K]) => void;
  subscribe: (fn: Subscriber<UIState>) => () => void;
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

export interface RenderingManagerContract {
  addRedrawPlugin: (plugin: RedrawPlugin) => void;
  drawDevOverlay: () => void;
  drawFullBackgroundImage: (
    img: HTMLImageElement,
    canvas?: HTMLCanvasElement
  ) => void;
  getContext: () => CanvasRenderingContext2D | null;
  getMousePositionFromEvent: (
    canvas: HTMLCanvasElement,
    evt: MouseEvent
  ) => { x: number; y: number };
  getNthTextElement: (n: number) => { layer: Layer; elemIndex: number } | null;
  getTextElements: () => {
    elem: TextLayerElement;
    layerIndex: number;
    elemIndex: number;
  }[];
  isOverTextResizeHandle: (
    mouse: { x: number; y: number },
    elem: TextLayerElement
  ) => boolean;
  isPointInTextElement: (
    mouse: { x: number; y: number },
    elem: TextLayerElement
  ) => boolean;
  removeRedrawPlugin: (plugin: RedrawPlugin) => void;
  renderLayersToContext: (
    ctx: CanvasRenderingContext2D,
    layers: Layer[]
  ) => void;
  requestRedraw: () => void;
  setCanvasToBackgroundImage: (
    canvas: HTMLCanvasElement,
    img: HTMLImageElement,
    maxWidth: number,
    maxHeight: number
  ) => void;
  showTextOverlay: (
    canvas: HTMLCanvasElement,
    elem: TextLayerElement,
    index: number,
    redraw: () => void
  ) => void;
}
