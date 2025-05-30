// File: frontend/src/application/types/app.ts

import type { Data, Helpers, Services, Utilities } from '../types/index.js';

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
};

// ================================================= //

export interface ErrorHandlerOptions {
  context?: Record<string, unknown> | string;
  fallback?: unknown;
  userMessage?: string;
}

// ================================================= //

export type ListenerRegistration = () => void | (() => void);

// ================================================= //

export interface State {
  canvas: CanvasState;
}

// ================================================= //

export type Subscriber<T> = (state: T) => void;
