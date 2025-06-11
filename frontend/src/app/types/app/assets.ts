// File: frontend/src/app/types/assets.ts

import { VisualLayer } from './index.js';

export interface AnimationGroup {
  id: string;
  layers: VisualLayer[];
  isPlaying: boolean;
  playbackRate: number;
}

export interface Asset {
  type:
    | 'background'
    | 'border'
    | 'font'
    | 'gif'
    | 'image'
    | 'overlay'
    | 'sticker';
  name: string;
  class: 'animation' | 'image' | 'text';
  src: string;
  ext: string;
  tags: string[];
  size_kb: number;
  hash_sha256: string;
  credits?: string;
  license?: string;
  tileable?: boolean;
  width?: number;
  height?: number;
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
  font:
    | {
        family: string;
        serif: boolean;
        style: string;
        weight: number | string;
      }
    | false;
  animation?: {
    frames: {
      count: number;
      rate: number; // fps
    };
    rotation?: {
      speed: 360; // degrees per second
      direction: 'clockwise' | 'counter-clockwise' | 'n/a';
    };
  };
}

export type AssetsExtra =
  | BackgroundExtra
  | BorderExtra
  | FontExtra
  | GifExtra
  | ImageExtra
  | OverlayExtra
  | StickerExtra;

export interface BackgroundExtra {
  width: Asset['width'];
  height: Asset['height'];
  animation?: Asset['animation'];
  tileable?: Asset['tileable'];
}
export interface BorderExtra {
  width: Asset['width'];
  height: Asset['height'];
  animation?: Asset['animation'];
  tileable?: Asset['tileable'];
}
export interface FontExtra {
  font: NonNullable<Asset['font']>;
}
export interface GifExtra {
  animation: Exclude<Asset['animation'], undefined>;
}
export interface ImageExtra {
  width: Asset['width'];
  height: Asset['height'];
  animation?: Asset['animation'];
  tileable?: Asset['tileable'];
}
export interface OverlayExtra {
  blendMode: Asset['blendMode'];
}
export interface StickerExtra {
  width: Asset['width'];
  height: Asset['height'];
  animation?: Asset['animation'];
}
