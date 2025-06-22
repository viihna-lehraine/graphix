// File: frontend/src/app/meta/index.ts

export {
  AnimationManager,
  CacheManager,
  CanvasStateService,
  ClientStateService,
  ErrorHandler,
  IDBStorageService,
  LayerService,
  LayoutManager,
  Notifier,
  LocalStorageService,
  RenderingManager,
  StateManager,
  StorageManager,
  UIManager,
  UIStateService
} from './class_list.js';
export type {
  AnimatedAssetProps,
  AnimationGroup,
  Asset,
  AssetClass,
  AssetsExtra,
  AssetType,
  BackgroundExtra,
  BackgroundLayer,
  BaseLayer,
  BorderExtra,
  BlendMode,
  Cache,
  CanvasLifecycleEvent,
  CanvasResizeOptions,
  CanvasState,
  ClientState,
  EnvConfig,
  EnvVarParser,
  EnvVarParserMap,
  ErrorHandlerOptions,
  FontExtra,
  GifAnimation,
  GifExtra,
  GifFrame,
  ImageExtra,
  ImageLayer,
  Layer,
  LayerElement,
  ListenerRegistration,
  NotifierLevel,
  OverlayExtra,
  RedrawPlugin,
  ResizePlugin,
  State,
  StateLifecycleHook,
  StickerExtra,
  Subscriber,
  TextLayerElement,
  TextStyle,
  TextUnit,
  UIState
} from './types/sys/index.js';
export type {
  AnimationManagerContract,
  CacheManagerContract,
  CanvasStateServiceContract,
  ClientStateServiceContract,
  ErrorHandlerServiceContract,
  IStorageService,
  LayerServiceContract,
  LayoutManagerContract,
  NotifierServiceContract,
  RenderingManagerContract,
  StateManagerContract,
  UIManagerContract,
  UIStateServiceContract
} from './types/contracts.js';
export type {
  AssetData,
  AssetExtensions,
  AssetManifest,
  AssetTags,
  Data,
  Defaults,
  DomBtnIds,
  DomClasses,
  DomDivIds,
  DomFormIds,
  DomIds,
  DomInputIds,
  EnvVars,
  ErrorMessages,
  FilePaths,
  Regex,
  StorageKeys
} from './types/data.js';
export type {
  AssetBrowserFunctions,
  Core,
  Engine,
  EngineHandlers,
  IOFunctions,
  Services,
  Typeguards,
  Utilities
} from './types/functions.js';
export { error_classes } from './errors/index.js';
export {
  AppStartupError,
  BuildError,
  CorruptManifestError,
  SystemError
} from './errors/system.js';
export {
  AssetLoadError,
  NetworkError,
  RenderFailureError,
  UnknownFatalError,
  UserFacingError
} from './errors/user_facing.js';
export type {
  AppStartupErrorInstance,
  AssetLoadErrorInstance,
  BuildErrorInstance,
  CorruptManifestErrorInstance,
  ErrorClasses,
  NetworkErrorInstance,
  RenderFailureErrorInstance,
  SystemErrorInstance,
  UnknownFatalErrorInstance,
  UserFacingErrorInstance
} from './types/errors.js';
