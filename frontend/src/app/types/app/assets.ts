// File: frontend/src/app/types/assets.ts

import { VisualLayer } from './index.js';

export interface AnimationGroup {
  id: string;
  layers: VisualLayer[];
  isPlaying: boolean;
  playbackRate: number;
}

export interface AnimationProps {
  frames: {
    count: number;
    rate: number; // fps
  };
  rotation?: {
    speed: 360; // degrees per second
    direction: 'clockwise' | 'counter-clockwise' | 'n/a';
  };
}

export type AssetClass = 'animation' | 'image' | 'text';

export type AssetManifestEntry =
  | BackgroundAsset
  | BorderAsset
  | FontAsset
  | GifAsset
  | ImageAsset
  | OverlayAsset
  | StickerAsset;

export interface BaseAsset {
  name: string;
  src: string /* path relative to assets/ */;
  size_kb: number;
  hash_sha256: string;
  class: string;
  extension: string;
  tags?: string[];
  credit?: string;
  license?: string;
}

export interface BackgroundAsset extends BaseAsset {
  tileable: boolean;
}

export interface BorderAsset extends BaseAsset {
  animated: boolean;
  width: number;
  shape: 'circle' | 'square' | 'rounded' | 'other';
}

export interface FontAsset extends BaseAsset {
  fontFamily: string;
  serif: boolean;
  style?: string;
  weight?: number | string;
}

export interface GifAsset extends BaseAsset {
  animation?: AnimationProps;
}

export interface ImageAsset extends BaseAsset {}

export interface OverlayAsset extends BaseAsset {
  blendMode?:
    | 'normal'
    | 'multiply'
    | 'screen'
    | 'overlay'
    | 'darken'
    | 'lighten'
    | 'color-dodge'
    | 'color-burn'
    | 'hard-light'
    | 'soft-light'
    | 'difference'
    | 'exclusion';
}

export interface StickerAsset extends BaseAsset {}

export type SupportedAsset =
  | ImageAsset
  | GifAsset
  | OverlayAsset
  | StickerAsset;
