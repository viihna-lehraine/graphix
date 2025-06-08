// File: frontend/src/application/types/app.ts

import type {
  Data,
  Helpers,
  Services,
  TextElement,
  Utilities
} from '../types/index.js';

// ================================================= //
// ================================================= //

export interface AppDependencies {
  data: Data;
  helpers: Helpers;
  services: Services;
  utilities: Utilities;
}

// ================================================= //

export interface CanvasRefs {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
}

// ================================================= //

export interface CanvasResizeOptions {
  canvas: HTMLCanvasElement;
  container: HTMLElement;
  preserveAspectRatio?: boolean;
}

// ================================================= //

export type CanvasState = {
  width: number;
  height: number;
  selectedTextIndex: number | null;
  textElements: TextElement[];
  // stickers: Sticker[];
};

// ================================================= //

export interface ClientState {
  viewportWidth: number;
  viewportHeight: number;
}

// ================================================= //

export interface ErrorHandlerOptions {
  context?: Record<string, unknown> | string;
  fallback?: unknown;
  userMessage?: string;
}

// ================================================= //

export type ListenerRegistration = (
  data: Data,
  services: Services
) => void | (() => void);

// ================================================= //

export interface Plugin {
  id: string;
  register: (deps: AppDependencies) => void | Promise<void>;
}

// ================================================= //

export type ResizePlugin = () => void;

// ================================================= //

export interface State {
  canvas: CanvasState;
  client: ClientState;
}

// ================================================= //

export type Subscriber<T> = (state: T) => void;

// ================================================= //

export type UIInitializer = (deps: AppDependencies) => void | Promise<void>;
