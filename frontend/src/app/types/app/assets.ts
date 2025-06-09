// File: frontend/src/app/types/assets.ts

export interface BaseAsset {
  name: string;
  src: string /* path relative to assets/ */;
  uploaded: Date;
  modified: Date;
  size_kb: number;
  hash_sha256: string;
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

export interface GifAsset extends BaseAsset {}

export interface ImageAsset extends BaseAsset {}

export interface OverlayAsset extends BaseAsset {
  blendMode:
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
