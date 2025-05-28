// File: frontend/src/application/types/app.ts

import type { Data, Helpers, Services, Utilities } from '../types/index.js';

// ================================================= //
// ================================================= //

export interface ErrorHandlerOptions {
  context?: Record<string, unknown> | string;
  fallback?: unknown;
  userMessage?: string;
}

// -------------------------------------------------- /

export interface CanvasRefs {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
}

// -------------------------------------------------- /

export type ListenerRegistration = () => void | (() => void);

// ================================================= //
// ================================================= //

export interface AppDependencies {
  data: Data;
  helpers: Helpers;
  services: Services;
  utilities: Utilities;
}
