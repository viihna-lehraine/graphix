// File: frontend/src/application/types/app/core.ts

import type { Core } from '../index.js';

export interface Cache {
  bgImg: HTMLImageElement | null;
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

export type ListenerRegistration = (core: Core) => void | (() => void);

export type NotifierLevel = 'info' | 'warn' | 'error' | 'success';

export interface Plugin {
  id: string;
  register: (core: Core) => void | Promise<void>;
}

export type RedrawPlugin = (ctx: CanvasRenderingContext2D, core: Core) => void;

export type ResizePlugin = () => void;

export type Subscriber<T> = (state: T) => void;

export interface TextElement {
  text: string;
  x: number;
  y: number;
  align: CanvasTextAlign;
  baseline: CanvasTextBaseline;
  color: string;
  font: string;
  fontFamily?: string;
  fontSize: number;
  fontWeight?: string;
  rotation?: number;
  scale?: number;
}

export type UIInitializer = (core: Core) => void | Promise<void>;
