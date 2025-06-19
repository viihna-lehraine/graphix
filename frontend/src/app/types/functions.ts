// File: frontend/src/app/types/functions.ts

import type {
  AssetType,
  Data,
  DebounceOptions,
  EnvVars,
  GifAnimation,
  ImageLayer,
  Layer
} from './index.js';
import { AnimationGroupManager } from '@engine/AnimationGroupManager.js';
import { CacheManager } from '@core/services/CacheManager.js';
import { ErrorHandler } from '@core/services/ErrorHandler.js';
import { LayerManager } from '@engine/LayerManager.js';
import { RenderingEngine } from '@engine/RenderingEngine.js';
import { ResizeManager } from '@core/services/ResizeManager.js';
import { StateManager } from '@core/services/state/StateManager.js';
import { StorageManager } from '@core/services/storage/StorageManager.js';

// ================================================== //
// ========= CORE FUNCTION OBJECTS ================== //
// ================================================== //

export interface Core {
  data: Required<Data>;
  env: Required<EnvVars>;
  helpers: Required<Helpers>;
  services: Required<Services>;
  utils: Required<Utilities>;
}

export interface Engine {
  animationGroupManager: AnimationGroupManager;
  assetBrowserFns: AssetBrowserFunctions;
  handlers: EngineHandlers;
  ioFns: IOFunctions;
  layerManager: LayerManager;
  renderingEngine: RenderingEngine;
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
  resizeManager: ResizeManager;
  stateManager: StateManager;
  storageManager: StorageManager;
};

export interface Utilities {
  data: DataUtils;
  dom: DomUtils;
  math: MathUtils;
  typeguards: Typeguards;
}

// ================================================== //
// ======= CORE FUNCTION OBJECT PARTIALS ============ //
// ================================================== //

export interface AppHelpers {
  noop: () => void;
}

export interface CanvasHelpers {
  mapBlendMode: (blendMode?: string) => GlobalCompositeOperation;
}

export interface DataHelpers {
  clone: <T>(data: T) => T;
  debounce<T extends (...args: unknown[]) => void>(
    fn: T,
    waitMs: number,
    options: DebounceOptions
  ): (...args: Parameters<T>) => void;
  getFileExtension: (file: File | Blob) => string;
  getFileName: (file: File | Blob) => string;
  getFileSizeInKB: (file: File | Blob) => number;
  getFileSHA256: (file: File | Blob) => Promise<string>;
  getFormattedTimestamp: () => string;
  getGifInfo: (file: File | Blob) => Promise<{
    width: number;
    height: number;
    frameCount: number;
  }>;
  getImageDimensions: (file: File | Blob) => Promise<{
    width: number;
    height: number;
  }>;
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

export interface DataUtils {
  detectFileType: (file: File) => Promise<string | undefined>;
  getAssetType: (relPath: string, ext: string) => AssetType;
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

export interface Typeguards {
  isImageLayer: (layer: Layer) => layer is ImageLayer;
}

// ================================================== //

export interface AssetBrowserFunctions {
  fileExtensionToVisualLayerType: (
    ext: string
  ) => 'static_image' | 'animated_image';
  render: (core: Core) => Promise<void>;
}

export interface EngineHandlers {
  addImageLayerFromFile: (file: File, core: Core) => Promise<void>;
  setBackgroundFromFile: (file: File, core: Core) => Promise<void>;
}

export interface IOFunctions {
  exportGif: (
    layers: Layer[],
    width: number,
    height: number,
    frameCount: number,
    core: Core,
    renderingEngine: RenderingEngine,
    fileName?: string
  ) => Promise<void>;
  exportStaticFile: (
    layers: Layer[],
    width: number,
    height: number,
    core: Core,
    renderingEngine: RenderingEngine,
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
    createGifAnimation: (arrayBuffer: ArrayBuffer) => GifAnimation,
    renderingEngine: RenderingEngine
  ) => Promise<void>;
}
