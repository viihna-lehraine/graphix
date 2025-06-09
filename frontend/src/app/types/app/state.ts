// File: frontend/src/app/types/app/state.ts

import type { VisualLayer } from './layers.js';

export type CanvasState = {
  width: number;
  height: number;
  layers: VisualLayer[];
  selectedLayerIndex: number | null;
  aspectRatio?: number | undefined;
};

export interface ClientState {
  viewportWidth: number;
  viewportHeight: number;
}

export interface State {
  canvas: CanvasState;
  client: ClientState;
}
