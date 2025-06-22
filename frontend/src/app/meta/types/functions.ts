// File: frontend/src/app/meta/types/functions.ts

import type {
  AssetType,
  Data,
  EnvVars,
  GifAnimation,
  ImageLayer,
  Layer
} from '../index.js';
import {
  AnimationManager,
  CacheManager,
  ErrorHandler,
  LayoutManager,
  LayerService,
  Notifier,
  RenderingManager,
  StateManager,
  StorageManager,
  SystemErrorInstance,
  UIManager,
  UserFacingErrorInstance
} from '../index.js';

// ================================================== //
// ========= CORE FUNCTION OBJECTS ================== //
// ================================================== //

export interface Core {
  data: Required<Data>;
  env: Required<EnvVars>;
  services: Required<Services>;
  utils: Required<Utilities>;
}

export interface Engine {
  animationManager: AnimationManager;
  assetBrowserFns: AssetBrowserFunctions;
  handlers: EngineHandlers;
  ioFns: IOFunctions;
  layerService: LayerService;
  renderingManager: RenderingManager;
  uiManager: UIManager;
}

export type Services = {
  cache: CacheManager;
  errors: ErrorHandler;
  notifier: Notifier;
  layoutManager: LayoutManager;
  stateManager: StateManager;
  storageManager: StorageManager;
};

export interface Utilities {
  clone: <T>(data: T) => T;
  debounce: <T extends (...args: Record<string, unknown>[]) => void>(
    fn: T,
    wait?: number
  ) => (...args: Parameters<T>) => void;
  detectFileType: (file: File) => Promise<string | undefined>;
  getAssetType: (relPath: string, ext: string) => AssetType;
  getCssVar: (name: string) => string;
  getElement: <T extends HTMLElement = HTMLElement>(id: string) => T;
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
  mapBlendMode: (blendMode?: string) => GlobalCompositeOperation;
  noop: () => void;
  retry: <T>(
    fn: () => Promise<T>,
    options?: {
      attempts?: number;
      delayMs?: number;
      onError?: (err: unknown, attempt: number) => void;
    }
  ) => Promise<T>;
  typeguards: Typeguards;
}

// ================================================== //
// ======= CORE FUNCTION OBJECT PARTIALS ============ //
// ================================================== //

export interface Typeguards {
  isImageLayer: (layer: Layer) => layer is ImageLayer;
  isSystemError: (error: unknown) => error is SystemErrorInstance;
  isUserFacingError: (error: unknown) => error is UserFacingErrorInstance;
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
    renderingManager: RenderingManager,
    fileName?: string
  ) => Promise<void>;
  exportStaticFile: (
    layers: Layer[],
    width: number,
    height: number,
    core: Core,
    renderingManager: RenderingManager,
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
    renderingManager: RenderingManager
  ) => Promise<void>;
}
