// File: frontend/src/app/types/functions.ts

import type {
  CanvasRefs,
  CanvasResizeOptions,
  CanvasState,
  Data,
  Float,
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
  TextElement,
  UnitInterval
} from './index.js';
import { ErrorHandler, Logger } from '../core/services/index.js';
import { StateManager } from '../core/services/state/StateManager.js';

// ================================================== //
// ========= CORE FUNCTION OBJECTS ================== //
// ================================================== //

export interface Helpers {
  app: { noop: () => void };
  brand: {
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
  };
  data: { clone: <T>(data: T) => T };
  math: {
    weightedRandom: (min: number, max: number, weight: number) => number;
  };
  time: {
    debounce: <T extends (...args: Record<string, unknown>[]) => void>(
      fn: T,
      wait?: number
    ) => (...args: Parameters<T>) => void;
  };
}

// ================================================== //

export type Services = {
  errors: ErrorHandler;
  log: Logger;
  stateManager: StateManager;
};

/* ================================================= */

export interface Utilities {
  canvas: {
    autoResize: (
      options: CanvasResizeOptions,
      services: Services
    ) => () => void;
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
  };
  dom: {
    getCssVar: (name: string) => string;
  };
  typeguards: {
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
    isUnitInterval: (value: number) => value is UnitInterval;
    parseNumberString(str: string): Float | Integer | undefined;
  };
}

// ================================================== //
// ======= CORE FUNCTION OBJECT PARTIALS ============ //
// ================================================== //

export type AppHelpers = Helpers['app'];
export type BrandHelpers = Helpers['brand'];
export type DataHelpers = Helpers['data'];
export type MathHelpers = Helpers['math'];

/* -------------------------------------------------- */

export type CanvasUtils = Utilities['canvas'];
export type DOMUtils = Utilities['dom'];
export type Typeguards = Utilities['typeguards'];

// ================================================== //
// ================================================== //

export interface CanvasFunctions {
  main: {
    clearCanvas: (ctx: CanvasRenderingContext2D, services: Services) => void;
    drawBoundary: (ctx: CanvasRenderingContext2D, services: Services) => void;
    get2DContext: (
      canvas: HTMLCanvasElement,
      services: Services
    ) => CanvasRenderingContext2D;
    getCanvasRefs: (data: Data, services: Services) => CanvasRefs;
    getMainCanvas: (data: Data, services: Services) => HTMLCanvasElement;
    redrawCanvas: (
      ctx: CanvasRenderingContext2D,
      state: CanvasState,
      services: Services
    ) => void;
    resizeCanvasToParent: (data: Data, services: Services) => void;
  };
  io: {
    download: {
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
        mainCanvasFns: MainCanvasFunctions,
        services: Services
      ) => Promise<void>;
    };
  };
  ui: {
    initialize(
      canvasIoFns: CanvasIOFunctions,
      data: Data,
      mainCanvasFns: MainCanvasFunctions,
      services: Services,
      textElementOverlayFns: TextElementOverlayFunctions,
      utils: Utilities
    ): Promise<void>;
  };
}

export type CanvasIOFunctions = CanvasFunctions['io'];
export type CanvasUIFunctions = CanvasFunctions['ui'];
export type MainCanvasFunctions = CanvasFunctions['main'];

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
