// File: frontend/src/app/meta/types/sys/engine.ts

import type { CanvasState } from '../../index.js';

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
