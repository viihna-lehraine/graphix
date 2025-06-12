// File: frontend/src/app/types/assets.ts

export type AssetClass = 'animated' | 'static';

export interface AnimatedAssetProps {
  frames: NonNullable<{
    count: number;
    rate: number; // fps
  }>;
  rotation:
    | {
        speed: number | 360; // degrees per second
        direction: 'clockwise' | 'counter-clockwise' | 'n/a';
      }
    | false;
}

export interface AnimationGroup {
  id: string;
  layers: Layer[];
  isPlaying: boolean;
  playbackRate: number;
}

export interface Asset {
  type: AssetType;
  name: string;
  class: AssetClass;
  src: string;
  ext: string;
  tags: string[];
  size_kb: number;
  hash_sha256: string;
  credits: string | false;
  license: string | false;
  tileable: boolean;
  width: number | false;
  height: number | false;
  font: FontAssetProps | false;
  animation: AnimatedAssetProps | false;
  blendMode?: BlendMode;
}

export type AssetsExtra =
  | BackgroundExtra
  | BorderExtra
  | FontExtra
  | GifExtra
  | ImageExtra
  | OverlayExtra
  | StickerExtra;

export type AssetType =
  | 'background'
  | 'border'
  | 'font'
  | 'gif'
  | 'image'
  | 'overlay'
  | 'sticker'
  | 'text';

export interface BackgroundExtra {
  width: Asset['width'];
  height: Asset['height'];
  animation: AnimatedAssetProps | false;
  tileable: Asset['tileable'];
}

export type BlendMode =
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

export interface BorderExtra {
  width: Asset['width'];
  height: Asset['height'];
  animation: AnimatedAssetProps | false;
  tileable: Asset['tileable'];
}

export type FontAssetProps = {
  family?: string;
  serif?: boolean;
  style?: string;
  weight?: number | string;
};

export type FontExtra = {
  font: FontAssetProps;
};

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

export type GifExtra = {
  animation: AnimatedAssetProps;
};

export interface ImageExtra {
  width: Asset['width'];
  height: Asset['height'];
  animation: AnimatedAssetProps | false;
  tileable: Asset['tileable'];
}

export interface Layer {
  id: string;
  name: string;
  opacity: number;
  visible: boolean;
  zIndex: number;
  blendMode: BlendMode;
  elements: LayerElement[];
}

export type LayerElement =
  | {
      kind: 'animated_image';
      id: string;
      asset: Asset;
      position: { x: number; y: number };
      scale: { x: number; y: number };
      rotation:
        | {
            speed: number;
            direction: 'clockwise' | 'counter-clockwise' | 'n/a';
            currentAngle: number; // in degrees
          }
        | false;
      gifFrames: GifFrame[];
      currentFrame: number;
      frameElapsed: number;
      element: HTMLImageElement | null; // the current frame image element
    }
  | {
      kind: 'static_image';
      id: string;
      asset: Asset;
      position: { x: number; y: number };
      scale: { x: number; y: number };
      rotation: number | 0;
      element: HTMLImageElement | null;
    }
  | {
      kind: 'text';
      id: string;
      asset: Asset;
      text: string;
      position: { x: number; y: number };
      align: CanvasTextAlign;
      baseline: CanvasTextBaseline;
      color: string;
      font: string;
      fontFamily?: string;
      fontSize?: number;
      fontWeight?: string | number;
      fontStyle?: string;
      rotation: number | 0;
      scale: { x: number; y: number };
      element: HTMLDivElement | null;
    };

export interface OverlayExtra {
  blendMode: BlendMode;
}

export interface StickerExtra {
  width: Asset['width'];
  height: Asset['height'];
  animation: AnimatedAssetProps | false;
}

export type TextLayerElement = Extract<LayerElement, { kind: 'text' }>;
