// File: frontend/src/app/types/app/engine.ts

import type { CanvasState } from '../index.js';

export type CanvasLifecycleEvent =
  | 'addLayer'
  | 'removeLayer'
  | 'undo'
  | 'redo'
  | 'clear';

export type StateLifecycleHook = (
  event: CanvasLifecycleEvent,
  state: CanvasState
) => void;
