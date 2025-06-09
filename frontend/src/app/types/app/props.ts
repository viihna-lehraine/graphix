// File: frontend/src/app/types/app/props.ts

export interface AnimationProps {
  type: 'custom' | 'gif' | 'video' | undefined;
  frames: {
    count: number;
    rate: number;
  };
  rotation?: {
    speed: 360; // degrees per second
    direction: 'clockwise' | 'counter-clockwise' | 'n/a';
  };
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
