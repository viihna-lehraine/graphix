// File: frontend/src/app/types/functions.ts

import type { Data, GifAnimation, TextElement, VisualLayer } from './index.js';
import {
  AnimationGroupManager,
  CacheManager,
  ErrorHandler,
  Logger,
  ResizeManager,
  StateManager,
  StorageManager
} from '../core/services/index.js';

// ================================================== //
// ========= CORE FUNCTION OBJECTS ================== //
// ================================================== //

export interface Core {
  data: Required<Data>;
  helpers: Required<Helpers>;
  services: Required<Services>;
  utils: Required<Utilities>;
}

export interface Helpers {
  app: AppHelpers;
  canvas: CanvasHelpers;
  data: DataHelpers;
  math: MathHelpers;
  time: TimeHelpers;
}

export type Services = {
  animationGroupManager: AnimationGroupManager;
  cache: CacheManager;
  errors: ErrorHandler;
  log: Logger;
  resizeManager: ResizeManager;
  stateManager: StateManager;
  storageManager: StorageManager;
};

export interface Utilities {
  canvas: CanvasUtils;
  data: DataUtils;
  dom: DomUtils;
  math: MathUtils;
}

// ================================================== //
// ======= CORE FUNCTION OBJECT PARTIALS ============ //
// ================================================== //

export interface AppHelpers {
  noop: () => void;
}

export interface CanvasHelpers {
  get2DContext: (canvas: HTMLCanvasElement) => CanvasRenderingContext2D;
  getMousePosition(
    canvas: HTMLCanvasElement,
    evt: MouseEvent
  ): {
    x: number;
    y: number;
  };
  isOverResizeHandle(
    mouse: { x: number; y: number },
    elem: TextElement,
    ctx: CanvasRenderingContext2D
  ): boolean;
  isPointInText(
    pt: { x: number; y: number },
    elem: TextElement,
    ctx: CanvasRenderingContext2D
  ): boolean;
  mapBlendMode: (blendMode?: string) => GlobalCompositeOperation;
}

export interface DataHelpers {
  clone: <T>(data: T) => T;
  getFileSizeInKB: (file: File | Blob) => number;
  getFileSHA256: (file: File | Blob) => Promise<string>;
}
export interface MathHelpers {
  weightedRandom: (min: number, max: number, weight: number) => number;
}

export interface TimeHelpers {
  debounce: <T extends (...args: Record<string, unknown>[]) => void>(
    fn: T,
    wait?: number
  ) => (...args: Parameters<T>) => void;
}

export interface CanvasUtils {
  drawVisualLayersToContext(
    ctx: CanvasRenderingContext2D,
    layers: VisualLayer[],
    helpers: Helpers,
    log: Services['log']
  ): void;
}

export interface DataUtils {
  detectFileType: (file: File) => Promise<string | undefined>;
}

export interface DomUtils {
  getCssVar: (name: string) => string;
}

export interface MathUtils {
  modulo: (x: number, n: number) => number;
  roundToStep: (x: number, step: number) => number;
  toDegrees: (rad: number) => number;
  toRadians: (deg: number) => number;
}

// ================================================== //

export interface IOFunctions {
  exportGif: (
    layers: VisualLayer[],
    width: number,
    height: number,
    frameCount: number,
    core: Core,
    fileName?: string
  ) => Promise<void>;
  exportStaticFile: (
    layers: VisualLayer[],
    width: number,
    height: number,
    core: Core,
    fileName?: string
  ) => Promise<void>;
  handleDownload(
    targetRef: { current: HTMLDivElement | null } | null,
    core: Core,
    fileName?: string
  ): Promise<void>;
  handleUpload: (
    file: File,
    core: Core,
    createGifAnimation: (arrayBuffer: ArrayBuffer) => GifAnimation
  ) => Promise<void>;
}

export interface OverlayFunctions {
  removeExistingOverlay(className: string): void;
  showTxtElemOverlay: (
    canvas: HTMLCanvasElement,
    elem: TextElement,
    index: number,
    core: Core,
    redraw: () => void
  ) => void;
}
