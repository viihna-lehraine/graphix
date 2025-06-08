// File: frontend/src/app/features/canvas/ui/dragText.ts

import type {
  Data,
  MainCanvasFunctions,
  Services,
  TextElementOverlayFunctions,
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
  mainCanvasFns: MainCanvasFunctions,
  services: Services,
  textElementOverlayFns: TextElementOverlayFunctions,
  utils: Utilities
): void {
  const { stateManager } = services;
  const redrawCanvas = mainCanvasFns.redrawCanvas;

  canvas.addEventListener('mousedown', (e: MouseEvent) => {
    dragging = false;
    isResizing = false;
    selectedTextIndex = null;
    resizeTargetIndex = null;

    const state = stateManager.getAll();
    const mouse = utils.canvas.getMousePosition(canvas, e);
    const ctx = canvas.getContext('2d')!;

    for (let i = state.canvas.textElements.length - 1; i >= 0; i--) {
      const elem = state.canvas.textElements[i];

      if (utils.canvas.isOverResizeHandle(mouse, elem, ctx)) {
        isResizing = true;
        resizeTargetIndex = i;
        initialMouseY = mouse.y;
        initialFontSize = elem.fontSize ?? 32;
        stateManager.setSelectedTextIndex(i);

        return;
      }

      if (utils.canvas.isPointInText(mouse, elem, ctx)) {
        selectedTextIndex = i;
        dragging = true;
        dragOffset.x = mouse.x - elem.x;
        dragOffset.y = mouse.y - elem.y;
        stateManager.setSelectedTextIndex(i);
        break;
      }
    }
  });

  canvas.addEventListener('mousemove', (e: MouseEvent) => {
    const ctx = canvas.getContext('2d')!;

    if (!ctx) {
      throw new Error('Canvas context not available');
    }
    if (isResizing && resizeTargetIndex !== null) {
      const elem = stateManager.getCanvas().textElements[resizeTargetIndex];
      const mouse = utils.canvas.getMousePosition(canvas, e);
      const deltaY = mouse.y - initialMouseY;
      const newFontSize = Math.max(10, initialFontSize + deltaY); // prevent negative/too small

      stateManager.updateTextElement(resizeTargetIndex, {
        ...elem,
        fontSize: newFontSize
      });

      redrawCanvas(ctx, stateManager.getCanvas(), services);
      return;
    }

    if (dragging && selectedTextIndex !== null) {
      const state = stateManager.getCanvas();
      const elem = state.textElements[selectedTextIndex];
      const mouse = utils.canvas.getMousePosition(canvas, e);

      stateManager.updateTextElement(selectedTextIndex, {
        ...elem,
        x: mouse.x - dragOffset.x,
        y: mouse.y - dragOffset.y
      });

      redrawCanvas(ctx, stateManager.getCanvas(), services);
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
    const state = stateManager.getAll();
    const mouse = utils.canvas.getMousePosition(canvas, e);

    for (let i = state.canvas.textElements.length - 1; i >= 0; i--) {
      const elem = state.canvas.textElements[i];

      if (utils.canvas.isPointInText(mouse, elem, canvas.getContext('2d')!)) {
        textElementOverlayFns.show(canvas, elem, i, data, services, () =>
          mainCanvasFns.redrawCanvas(
            canvas.getContext('2d')!,
            services.stateManager.getCanvas(),
            services
          )
        );

        break;
      }
    }
  });
}
