// File: frontend/src/app/meta/types/sys/engine.ts

import type { CanvasState } from '@index';

export type CanvasLifecycleEvent =
  | 'addLayer'
  | 'removeLayer'
  | 'undo'
  | 'redo'
  | 'clear';

export type FitMode = 'stretch' | 'contain' | 'cover';

export type StateLifecycleHook = (
  event: CanvasLifecycleEvent,
  state: CanvasState
) => void;
