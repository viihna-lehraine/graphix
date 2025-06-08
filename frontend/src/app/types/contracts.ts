// File: frontend/src/app/types/contracts.ts

import type {
  CanvasState,
  ClientState,
  ErrorHandlerOptions,
  ResizePlugin,
  State,
  Subscriber,
  TextElement
} from './index.js';

// ================================================== //
// ================================================== //

export interface CanvasStateServiceContract {
  addTextElement: (elem: TextElement) => void;
  canRedo: () => boolean;
  canUndo: () => boolean;
  clearAll: () => void;
  get: () => CanvasState;
  moveTextElement: (index: number, x: number, y: number) => void;
  redo: () => void;
  removeTextElement: (index: number) => void;
  reset: () => void;
  set: (width: number, height: number) => void;
  setSelectedTextIndex: (index: number | null) => void;
  subscribe: (fn: Subscriber<CanvasState>) => () => void;
  undo: () => void;
  updateTextElement: (index: number, newElem: TextElement) => void;
}

// --------------------------------------------------- //

export interface ClientStateServiceContract {
  get: () => ClientState;
  set: (viewportWidth: number, viewportHeight: number) => void;
  subscribe: (fn: Subscriber<ClientState>) => () => void;
}

// ---------------------------------------------------- //

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

/* --------------------------------------------------- */

export interface LoggerServiceContract {
  debug: (message: string, caller?: string) => void;
  error: (message: string, caller?: string) => void;
  info: (message: string, caller?: string) => void;
  warn: (message: string, caller?: string) => void;
}

/* --------------------------------------------------- */

export interface ResizeManagerContract {
  initialize: () => void;
  register: (plugin: ResizePlugin) => void;
  runAll: () => void;
  unregister: (plugin: ResizePlugin) => void;
}

/* --------------------------------------------------- */

export interface StateManagerContract {
  canRedoCanvas: () => boolean;
  canUndoCanvas: () => boolean;
  clearCanvasAll(): void;
  getAll: () => State;
  getCanvas: () => CanvasState;
  getClient: () => ClientState;
  resetCanvas: () => void;
  setCanvas: (width: number, height: number) => void;
  setClient: (viewportWidth: number, viewportHeight: number) => void;
  setSelectedTextIndex: (index: number | null) => void;
  subscribeToCanvas: (fn: Subscriber<CanvasState>) => () => void;
  subscribeToClient: (fn: Subscriber<ClientState>) => () => void;
  redoCanvas: () => void;
  undoCanvas: () => void;
  updateTextElement: (index: number, newElem: TextElement) => void;
}
