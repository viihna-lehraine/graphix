// File: frontend/src/app/types/layers.ts

import type {
  AnimationProps,
  OverlayAsset,
  SupportedAsset,
  TextElement
} from '../index.js';

export interface BaseVisualLayer {
  id: string;
  type: string;
  assetRef: SupportedAsset | null;
  opacity: number;
  visible: boolean;
  zIndex: number;
  position?: { x: number; y: number };
  rotation?: {
    speed: number;
    direction: 'clockwise' | 'counter-clockwise' | 'n/a';
    currentAngle: number;
  };
  scale?: { x: number; y: number };
}

export interface GifAnimation {
  frames: GifFrame[];
  isPlaying: () => boolean;
  pause: () => void;
  play: (ctx: CanvasRenderingContext2D, loop?: boolean) => void;
  stop: () => void;
}

export interface GifFrame {
  imageData: ImageData;
  delay: number; // in ms
}

export interface GifVisualLayer extends BaseVisualLayer {
  type: 'gif';
  animationProps?: AnimationProps;
  gifFrames: GifFrame[];
  currentFrame: number;
  frameElapsed: number;
}

export interface ImageVisualLayer extends BaseVisualLayer {
  type: 'image';
  element: HTMLImageElement;
}

export interface OverlayVisualLayer extends BaseVisualLayer {
  type: 'overlay';
  blendMode?: OverlayAsset['blendMode'];
  element: HTMLImageElement | HTMLCanvasElement;
}

export interface StickerVisualLayer extends BaseVisualLayer {
  type: 'sticker';
  element: HTMLImageElement | HTMLCanvasElement;
}

export interface TextVisualLayer extends BaseVisualLayer {
  type: 'text';
  textElements: TextElement[];
}

export interface VideoVisualLayer extends BaseVisualLayer {
  type: 'video';
  element: HTMLVideoElement;
}

export type VisualLayer =
  | ImageVisualLayer
  | GifVisualLayer
  | OverlayVisualLayer
  | StickerVisualLayer
  | TextVisualLayer
  | VideoVisualLayer;
