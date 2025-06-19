// File: frontend/src/application/types/app/core.ts

import type { Core, Engine } from '../index.js';

export interface Cache {
  bgImg: HTMLImageElement | null;
}

export interface CanvasResizeOptions {
  canvas: HTMLCanvasElement;
  container: HTMLElement;
  preserveAspectRatio?: boolean;
}

export type DebounceOptions = {
  // if true, function is triggered on the leading edge instead of the trailing.
  leading?: boolean;
  // If true, ensures the function is called after the wait time even if it's still being debounced.
  trailing?: boolean;
  // max time the function is allowed to be delayed before it's forcibly invoked.
  maxWaitMs?: number;
};

export interface ErrorHandlerOptions {
  context?: Record<string, unknown> | string;
  fallback?: unknown;
  userMessage?: string;
}

export type ListenerRegistration = (core?: Core) => void | (() => void);

export type NotifierLevel = 'info' | 'warn' | 'error' | 'success';

export interface Plugin {
  id: string;
  register: (core: Core) => void | Promise<void>;
}

export type RedrawPlugin = (ctx: CanvasRenderingContext2D, core: Core) => void;

export type ResizePlugin = () => void;

export type Subscriber<T> = (state: T) => void;

export type UIInitializer = (deps: {
  core: Core;
  engine: Engine;
}) => void | Promise<void>;
