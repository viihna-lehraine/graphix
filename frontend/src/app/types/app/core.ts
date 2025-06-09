// File: frontend/src/application/types/app/core.ts

import type { Data, Helpers, Hex, Services, Utilities } from '../index.js';

// ================================================= //

export interface AppDependencies {
  data: Data;
  helpers: Helpers;
  services: Services;
  utils: Utilities;
}

export interface CanvasRefs {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
}

export interface CanvasResizeOptions {
  canvas: HTMLCanvasElement;
  container: HTMLElement;
  preserveAspectRatio?: boolean;
}

export interface ErrorHandlerOptions {
  context?: Record<string, unknown> | string;
  fallback?: unknown;
  userMessage?: string;
}

export type ListenerRegistration = (
  data: Data,
  services: Services
) => void | (() => void);

export interface Plugin {
  id: string;
  register: (deps: AppDependencies) => void | Promise<void>;
}

export type ResizePlugin = () => void;

export type Subscriber<T> = (state: T) => void;

export interface TextElement {
  text: string;
  x: number;
  y: number;
  align: CanvasTextAlign;
  baseline: CanvasTextBaseline;
  color: Hex;
  font: string;
  fontFamily?: string;
  fontSize: number;
  fontWeight?: string;
  rotation?: number;
  scale?: number;
}

export type UIInitializer = (deps: AppDependencies) => void | Promise<void>;
