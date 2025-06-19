// File: frontend/src/app/featurtes/engine/ui/init/setupTextDragHandlers.ts

import type { Core, Engine } from '../../../../types/index.js';

export async function setupTextDragHandlers(
  canvas: HTMLCanvasElement,
  core: Core,
  engine: Engine
): Promise<void> {
  // drag state
  let dragging = false;
  let isResizing = false;
  let dragTarget = null as null | { layerIndex: number; elemIndex: number };
  let resizeTarget = null as null | { layerIndex: number; elemIndex: number };
  let dragOffset = { x: 0, y: 0 };
  let initialMouseY = 0;
  let initialFontSize = 32;

  return core.services.errors.handleAsync(async () => {
    canvas.addEventListener('mousedown', (e: MouseEvent) => {
      dragging = false;
      isResizing = false;
      dragTarget = null;
      resizeTarget = null;

      const state = core.services.stateManager.getCanvas();
      const mouse = core.helpers.canvas.getMousePosition(canvas, e);
      const ctx = canvas.getContext('2d')!;

      const textElems = core.utils.canvas.findTextElements(state.layers);

      for (let i = textElems.length - 1; i >= 0; i--) {
        const { elem, layerIndex, elemIndex } = textElems[i];

        // check resize handle first
        if (core.helpers.canvas.isOverResizeHandle(mouse, elem, ctx)) {
          isResizing = true;
          resizeTarget = { layerIndex, elemIndex };
          initialMouseY = mouse.y;
          initialFontSize = elem.fontSize ?? 32;
          core.services.stateManager.setSelectedLayerIndex(layerIndex);
          return;
        }

        for (let i = state.layers.length - 1; i >= 0; i--) {
          const layer = state.layers[i];

          if (
            core.utils.typeguards.isImageLayer(layer) &&
            (layer.element.kind === 'static_image' ||
              layer.element.kind === 'animated_image')
          ) {
            const elem = layer.element;
            const img = elem.element;
            if (!img) continue;

            // calculate handle position (matches #drawTextAndSelection logic)
            const handleX = elem.position.x + img.width * elem.scale.x;
            const handleY = elem.position.y + img.height * elem.scale.y;

            // is mouse near the handle?
            const isOver =
              Math.abs(mouse.x - handleX) <= 10 &&
              Math.abs(mouse.y - handleY) <= 10;
            if (isOver) {
              isResizing = true;
              resizeTarget = { layerIndex: i, elemIndex: 0 };
              dragOffset.x = mouse.x - handleX;
              dragOffset.y = mouse.y - handleY;
              core.services.stateManager.setSelectedLayerIndex(i);

              return;
            }
          }
        }

        // check if point in text
        if (core.helpers.canvas.isPointInText(mouse, elem, ctx)) {
          dragging = true;
          dragTarget = { layerIndex, elemIndex };
          dragOffset.x = mouse.x - elem.position.x;
          dragOffset.y = mouse.y - elem.position.y;
          core.services.stateManager.setSelectedLayerIndex(layerIndex);
          return;
        }
      }

      for (let i = state.layers.length - 1; i >= 0; i--) {
        const layer = state.layers[i];
        if (
          core.utils.typeguards.isImageLayer(layer) &&
          (layer.element.kind === 'static_image' ||
            layer.element.kind === 'animated_image')
        ) {
          const elem = layer.element;
          const img = elem.element;
          if (!img) continue;

          const x = elem.position.x;
          const y = elem.position.y;
          const w = img.width * elem.scale.x;
          const h = img.height * elem.scale.y;

          if (
            mouse.x >= x &&
            mouse.x <= x + w &&
            mouse.y >= y &&
            mouse.y <= y + h
          ) {
            dragging = true;
            dragTarget = { layerIndex: i, elemIndex: 0 };
            dragOffset.x = mouse.x - x;
            dragOffset.y = mouse.y - y;
            core.services.stateManager.setSelectedLayerIndex(i);
            return;
          }
        }
      }
    });

    canvas.addEventListener('mousemove', (e: MouseEvent) => {
      const ctx = canvas.getContext('2d')!;
      const state = core.services.stateManager.getCanvas();

      if (isResizing && resizeTarget) {
        const { layerIndex } = resizeTarget;
        const layer = state.layers[layerIndex];

        if (core.utils.typeguards.isImageLayer(layer)) {
          const elem = layer.element;
          const mouse = core.helpers.canvas.getMousePosition(canvas, e);

          if (elem.kind === 'text') {
            const deltaY = mouse.y - initialMouseY;
            const newFontSize = Math.max(10, initialFontSize + deltaY);
            const updatedElem = { ...elem, fontSize: newFontSize };
            layer.element = updatedElem;
            engine.renderingEngine.redraw(
              ctx,
              core.services.stateManager.getCanvas()
            );
            return;
          }

          if (elem.kind === 'static_image' && elem.element) {
            const img = elem.element;
            const startX = elem.position.x;
            const startY = elem.position.y;
            let newScaleX = (mouse.x - startX) / img.width;
            let newScaleY = (mouse.y - startY) / img.height;

            newScaleX = Math.max(newScaleX, 0.1);
            newScaleY = Math.max(newScaleY, 0.1);
            // Update
            layer.element = {
              ...elem,
              scale: { x: newScaleX, y: newScaleY }
            };
            engine.renderingEngine.redraw(
              ctx,
              core.services.stateManager.getCanvas()
            );
            return;
          }
        }
        return;
      }

      if (dragging && dragTarget) {
        const { layerIndex } = dragTarget;
        const layer = state.layers[layerIndex];

        if (core.utils.typeguards.isImageLayer(layer)) {
          const elem = layer.element;
          if (elem.kind !== 'text') return;

          const mouse = core.helpers.canvas.getMousePosition(canvas, e);

          const updatedElem = {
            ...elem,
            position: {
              x: mouse.x - dragOffset.x,
              y: mouse.y - dragOffset.y
            }
          };
          layer.element = updatedElem;

          engine.renderingEngine.redraw(
            ctx,
            core.services.stateManager.getCanvas()
          );
        }
      }
    });

    canvas.addEventListener('mouseup', () => {
      dragging = false;
      isResizing = false;
      dragTarget = null;
      resizeTarget = null;
    });

    canvas.addEventListener('mouseleave', () => {
      dragging = false;
      isResizing = false;
      dragTarget = null;
      resizeTarget = null;
    });

    canvas.addEventListener('dblclick', (e: MouseEvent) => {
      const state = core.services.stateManager.getCanvas();
      const mouse = core.helpers.canvas.getMousePosition(canvas, e);
      const ctx = canvas.getContext('2d')!;
      const textElems = core.utils.canvas.findTextElements(state.layers);

      for (let i = textElems.length - 1; i >= 0; i--) {
        const { elem, elemIndex } = textElems[i];
        if (core.helpers.canvas.isPointInText(mouse, elem, ctx)) {
          engine.overlayFns.showTxtElemOverlay(
            canvas,
            elem,
            elemIndex,
            core,
            () =>
              engine.renderingEngine.redraw(
                ctx,
                core.services.stateManager.getCanvas()
              )
          );
          break;
        }
      }
    });
  }, 'Unhandled text drag handlers initialization error.');
}
