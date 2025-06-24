// File: frontend/src/application/meta/types/sys/core.ts

import type { Core } from '@index';
import { RenderingManager } from '@index';

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
  suppressAlert?: boolean;
  suppressConsole?: boolean;
  userMessage?: string;
  retry?:
    | boolean
    | {
        attempts?: number;
        delayMs?: number;
        onError?: (error: unknown, attempt: number) => void;
      };
}

export type ListenerRegistration = (
  core: Core,
  renderingManager: RenderingManager
) => void | (() => void);

export type NotifierLevel = 'info' | 'warn' | 'error' | 'success';

export type RedrawPlugin = (ctx: CanvasRenderingContext2D, core: Core) => void;

export type ResizePlugin = () => void;

export type Subscriber<T> = (state: T) => void;
