// File: frontend/src/app/types/functions.ts

import type {
  CanvasRefs,
  CanvasResizeOptions,
  CanvasState,
  Data,
  Float,
  GifAnimation,
  Hex,
  Integer,
  NonNegativeInteger,
  NonNegativeNumber,
  NonZeroNumber,
  NonZeroInteger,
  Percentile,
  PositiveInteger,
  PositiveNumber,
  SignedPercentile,
  SupportedExt,
  TextElement,
  UnitInterval,
  VisualLayer
} from './index.js';
import { AnimationGroupManager } from '../core/services/dom/AnimationGroupManager.js';
import { CanvasCacheService } from '../core/services/CanvasCacheService.js';
import { ErrorHandler, Logger } from '../core/services/index.js';
import { ResizeManager } from '../core/services/dom/ResizeManager.js';
import { StateManager } from '../core/services/state/StateManager.js';

// ================================================== //
// ========= CORE FUNCTION OBJECTS ================== //
// ================================================== //

export interface Core {
  helpers: Helpers;
  services: Services;
  utilities: Utilities;
}

export interface Helpers {
  app: AppHelpers;
  brand: BrandHelpers;
  canvas: CanvasHelpers;
  data: DataHelpers;
  math: MathHelpers;
  time: TimeHelpers;
}

export type Services = {
  animationGroupManager: AnimationGroupManager;
  canvasIO: CanvasIOFunctions;
  errors: ErrorHandler;
  log: Logger;
  canvasCache: CanvasCacheService;
  resizeManager: ResizeManager;
  stateManager: StateManager;
};

export interface Utilities {
  canvas: CanvasUtils;
  dom: DomUtils;
  typeguards: Typeguards;
}

// ================================================== //
// ======= CORE FUNCTION OBJECT PARTIALS ============ //
// ================================================== //

export interface AppHelpers {
  noop: () => void;
}

export interface BrandHelpers {
  asBrandedFromString<T>(
    str: string,
    check: (n: number) => boolean,
    brand: (n: number) => T
  ): T;
  asFloat: (x: number) => Float;
  asInteger: (x: number) => Integer;
  asNonNegativeInteger: (x: number) => NonNegativeInteger;
  asNonNegativeNumber: (x: number) => NonNegativeNumber;
  asNonZeroInteger: (x: number) => NonZeroInteger;
  asNonZeroNumber: (x: number) => NonZeroNumber;
  asPercentile: (x: number) => Percentile;
  asPositiveInteger: (x: number) => PositiveInteger;
  asPositiveNumber: (x: number) => PositiveNumber;
  asSignedPercentile: (x: number) => SignedPercentile;
  asUnitInterval: (x: number) => UnitInterval;
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

/* -------------------------------------------------- */

export interface CanvasUtils {
  autoResize: (options: CanvasResizeOptions, services: Services) => () => void;
  clearCanvas: (ctx: CanvasRenderingContext2D) => void;
  drawBoundary: (ctx: CanvasRenderingContext2D) => void;
  drawTextAndSelection: (
    ctx: CanvasRenderingContext2D,
    layers: VisualLayer[],
    selectedLayerIndex: number | null
  ) => void;
  drawVisualLayers(ctx: CanvasRenderingContext2D, layers: VisualLayer[]): void;
  getCanvasElement(): HTMLCanvasElement;
  getRefs(): CanvasRefs;
  redraw(ctx: CanvasRenderingContext2D, state: CanvasState): void;
  resizeCanvasToParent(): void;
}

export interface DomUtils {
  getCssVar: (name: string) => string;
}

export interface Typeguards {
  isFloat: (value: number) => value is Float;
  isFloatString: (string: string) => boolean;
  isHex: (value: string) => value is Hex;
  isInteger: (value: number) => value is Integer;
  isIntegerString: (string: string) => boolean;
  isNonNegativeInteger: (value: number) => value is NonNegativeInteger;
  isNonNegativeNumber: (value: number) => value is NonNegativeNumber;
  isNonZeroInteger: (value: number) => value is NonZeroInteger;
  isNonZeroNumber: (value: number) => value is NonZeroNumber;
  isPercentile: (value: number) => value is Percentile;
  isPositiveInteger: (value: number) => value is PositiveInteger;
  isPositiveNumber: (value: number) => value is PositiveNumber;
  isSignedPercentile: (value: number) => value is SignedPercentile;
  isSupportedExt: (ext: string) => ext is SupportedExt;
  isUnitInterval: (value: number) => value is UnitInterval;
  parseNumberString(str: string): Float | Integer | undefined;
}

// ================================================== //

export interface CanvasIOFunctions {
  download: {
    exportGif: (
      layers: VisualLayer[],
      width: number,
      height: number,
      frameCount: number,
      fileName: string,
      utils: Utilities
    ) => Promise<void>;
    exportStaticFile: (
      layers: VisualLayer[],
      width: number,
      height: number,
      fileName: string,
      utils: Utilities
    ) => Promise<void>;
    handle: (
      fileName: string | null,
      targetRef: React.RefObject<HTMLDivElement | null>,
      services: Services
    ) => Promise<void>;
  };
  upload: {
    handle: (
      file: File,
      data: Data,
      helpers: Helpers,
      services: Services,
      utils: Utilities,
      createGifAnimation: (arrayBuffer: ArrayBuffer) => GifAnimation
    ) => Promise<void>;
  };
}

export interface TextElementOverlayFunctions {
  show: (
    canvas: HTMLCanvasElement,
    elem: TextElement,
    index: number,
    data: Data,
    services: Services,
    redraw: () => void
  ) => void;
}
