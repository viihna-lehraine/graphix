// File: frontend/src/app/features/engine/events/dragText.ts

import type {
  Data,
  Helpers,
  Services,
  TextElementOverlayFunctions,
  TextVisualLayer,
  Utilities
} from '../../../types/index.js';

// ================================================== //

let selectedTextIndex: number | null = null;
let dragging = false;
let dragOffset = { x: 0, y: 0 };
let isResizing = false;
let resizeTargetIndex: number | null = null;
let initialMouseY = 0;
let initialFontSize = 32;

export function setupTextDragHandlers(
  canvas: HTMLCanvasElement,
  data: Data,
  helpers: Helpers,
  services: Services,
  textElementOverlayFns: TextElementOverlayFunctions,
  utils: Utilities
): void {
  const { stateManager } = services;

  canvas.addEventListener('mousedown', (e: MouseEvent) => {
    dragging = false;
    isResizing = false;
    selectedTextIndex = null;
    resizeTargetIndex = null;

    const state = stateManager.getAll();
    const mouse = helpers.canvas.getMousePosition(canvas, e);
    const ctx = canvas.getContext('2d')!;

    const textLayer = state.canvas.layers.find(
      (layer): layer is TextVisualLayer => layer.type === 'text'
    );

    if (!textLayer) return;

    for (let i = textLayer.textElements.length - 1; i >= 0; i--) {
      const elem = textLayer.textElements[i];

      if (helpers.canvas.isOverResizeHandle(mouse, elem, ctx)) {
        isResizing = true;
        resizeTargetIndex = i;
        initialMouseY = mouse.y;
        initialFontSize = elem.fontSize ?? 32;
        stateManager.setSelectedLayerIndex(i);

        return;
      }

      if (helpers.canvas.isPointInText(mouse, elem, ctx)) {
        selectedTextIndex = i;
        dragging = true;
        dragOffset.x = mouse.x - elem.x;
        dragOffset.y = mouse.y - elem.y;
        stateManager.setSelectedLayerIndex(i);
        break;
      }
    }
  });

  canvas.addEventListener('mousemove', (e: MouseEvent) => {
    const ctx = canvas.getContext('2d')!;
    const state = stateManager.getCanvas();

    const textLayer = state.layers.find(layer => layer.type === 'text') as
      | TextVisualLayer
      | undefined;

    if (!textLayer) return;

    if (isResizing && resizeTargetIndex !== null) {
      const elem = textLayer.textElements[resizeTargetIndex];
      const mouse = helpers.canvas.getMousePosition(canvas, e);
      const deltaY = mouse.y - initialMouseY;
      const newFontSize = Math.max(10, initialFontSize + deltaY);

      // Update element
      const updatedElem = { ...elem, fontSize: newFontSize };
      textLayer.textElements[resizeTargetIndex] = updatedElem;

      utils.canvas.redraw(ctx, stateManager.getCanvas());
      return;
    }

    if (dragging && selectedTextIndex !== null) {
      const elem = textLayer.textElements[selectedTextIndex];
      const mouse = helpers.canvas.getMousePosition(canvas, e);

      const updatedElem = {
        ...elem,
        x: mouse.x - dragOffset.x,
        y: mouse.y - dragOffset.y
      };
      textLayer.textElements[selectedTextIndex] = updatedElem;

      utils.canvas.redraw(ctx, stateManager.getCanvas());
    }
  });

  canvas.addEventListener('mouseup', () => {
    dragging = false;
    isResizing = false;
    resizeTargetIndex = null;
  });

  canvas.addEventListener('mouseleave', () => {
    dragging = false;
    isResizing = false;
    resizeTargetIndex = null;
  });

  canvas.addEventListener('dblclick', (e: MouseEvent) => {
    const state = stateManager.getCanvas();
    const mouse = helpers.canvas.getMousePosition(canvas, e);

    const textLayer = state.layers.find(layer => layer.type === 'text') as
      | TextVisualLayer
      | undefined;

    if (!textLayer) return;

    for (let i = textLayer.textElements.length - 1; i >= 0; i--) {
      const elem = textLayer.textElements[i];

      if (helpers.canvas.isPointInText(mouse, elem, canvas.getContext('2d')!)) {
        textElementOverlayFns.show(canvas, elem, i, data, services, () =>
          utils.canvas.redraw(
            canvas.getContext('2d')!,
            services.stateManager.getCanvas()
          )
        );

        break;
      }
    }
  });
}
