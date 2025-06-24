// File: frontend/src/app/meta/types/sys/state.ts

import type { FitMode, Layer } from '@index';

export type CanvasState = {
  width: number;
  height: number;
  layers: Layer[];
  selectedLayerIndex: number | null;
  bgFitMode: FitMode;
  aspectRatio?: number | undefined;
};

export interface ClientState {
  viewportWidth: number;
  viewportHeight: number;
}

export interface UIState {
  uploadMode: UploadMode;
}

export interface State {
  version: string;
  canvas: CanvasState;
  client: ClientState;
  ui: UIState;
}

export type UploadMode = 'background' | 'image' | null;
