// File: frontend/src/app/types/app/state.ts

import type { Layer } from './index.js';

export type CanvasState = {
  width: number;
  height: number;
  layers: Layer[];
  selectedLayerIndex: number | null;
  aspectRatio?: number | undefined;
};

export interface ClientState {
  viewportWidth: number;
  viewportHeight: number;
}

export interface State {
  version: string;
  canvas: CanvasState;
  client: ClientState;
}
