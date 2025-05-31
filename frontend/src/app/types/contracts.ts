// File: frontend/src/app/types/contracts.ts

import type {
  CanvasState,
  ClientState,
  ErrorHandlerOptions,
  State,
  Subscriber
} from './application.js';

// ================================================== //
// ================================================== //

export interface CanvasStateServiceContract {
  canRedo: () => boolean;
  canUndo: () => boolean;
  get: () => CanvasState;
  redo: () => void;
  reset: () => void;
  set: (width: number, height: number) => void;
  subscribe: (fn: Subscriber<CanvasState>) => () => void;
  undo: () => void;
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
  getAll: () => State;
  getCanvas: () => CanvasState;
  getClient: () => ClientState;
  resetCanvas: () => void;
  setCanvas: (width: number, height: number) => void;
  setClient: (viewportWidth: number, viewportHeight: number) => void;
  subscribeToCanvas: (fn: Subscriber<CanvasState>) => () => void;
  subscribeToClient: (fn: Subscriber<ClientState>) => () => void;
  redoCanvas: () => void;
  undoCanvas: () => void;
}
