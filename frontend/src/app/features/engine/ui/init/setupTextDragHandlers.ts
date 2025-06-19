// File: frontend/src/app/featurtes/engine/ui/init/setupTextDragHandlers.ts

import type { Core, Engine } from '../../../../types/index.js';

export async function setupTextDragHandlers(
  canvas: HTMLCanvasElement,
  core: Core,
  engine: Engine
): Promise<void> {
  let dragging = false;
  let isResizing = false;
  let dragTarget: { layerIndex: number } | null = null;
  let resizeTarget: { layerIndex: number } | null = null;
  let dragOffset = { x: 0, y: 0 };
  let initialMouseY = 0;
  let initialFontSize = 32;

  return core.services.errors.handleAsync(async () => {
    canvas.addEventListener('mousedown', e => {
      dragging = false;
      isResizing = false;
      dragTarget = null;
      resizeTarget = null;

      const state = core.services.stateManager.getCanvas();
      const mouse = engine.renderingEngine.getMousePositionFromEvent(canvas, e);
      const textElems = engine.renderingEngine.getTextElements();

      for (let i = textElems.length - 1; i >= 0; i--) {
        const { elem, layerIndex } = textElems[i];
        const ctx = engine.renderingEngine.getContext();
        if (!ctx) return;

        if (engine.renderingEngine.isOverTextResizeHandle(mouse, elem)) {
          isResizing = true;
          resizeTarget = { layerIndex };
          initialMouseY = mouse.y;
          initialFontSize = elem.fontSize ?? 32;
          core.services.stateManager.setSelectedLayerIndex(layerIndex);
          return;
        }

        if (engine.renderingEngine.isPointInTextElement(mouse, elem)) {
          dragging = true;
          dragTarget = { layerIndex };
          dragOffset = {
            x: mouse.x - elem.position.x,
            y: mouse.y - elem.position.y
          };
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
            dragTarget = { layerIndex: i };
            dragOffset = { x: mouse.x - x, y: mouse.y - y };
            core.services.stateManager.setSelectedLayerIndex(i);
            return;
          }
        }
      }
    });

    canvas.addEventListener('mousemove', e => {
      const state = core.services.stateManager.getCanvas();
      const mouse = engine.renderingEngine.getMousePositionFromEvent(canvas, e);

      if (isResizing && resizeTarget) {
        const { layerIndex } = resizeTarget;
        const layer = state.layers[layerIndex];
        if (!core.utils.typeguards.isImageLayer(layer)) return;

        const elem = layer.element;

        if (elem.kind === 'text') {
          const deltaY = mouse.y - initialMouseY;
          const newFontSize = Math.max(10, initialFontSize + deltaY);
          elem.fontSize = newFontSize;
          engine.renderingEngine.requestRedraw();
          return;
        }

        if (elem.kind === 'static_image' && elem.element) {
          const img = elem.element;
          const newScaleX = Math.max(
            (mouse.x - elem.position.x) / img.width,
            0.1
          );
          const newScaleY = Math.max(
            (mouse.y - elem.position.y) / img.height,
            0.1
          );
          elem.scale = { x: newScaleX, y: newScaleY };
          engine.renderingEngine.requestRedraw();
        }

        return;
      }

      if (dragging && dragTarget) {
        const { layerIndex } = dragTarget;
        const layer = state.layers[layerIndex];
        if (!core.utils.typeguards.isImageLayer(layer)) return;

        const elem = layer.element;
        elem.position = {
          x: mouse.x - dragOffset.x,
          y: mouse.y - dragOffset.y
        };

        engine.renderingEngine.requestRedraw();
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

    canvas.addEventListener('dblclick', e => {
      const mouse = engine.renderingEngine.getMousePositionFromEvent(canvas, e);
      const textElems = engine.renderingEngine.getTextElements();
      const ctx = engine.renderingEngine.getContext();
      if (!ctx) return;

      for (let i = textElems.length - 1; i >= 0; i--) {
        const { elem, elemIndex } = textElems[i];
        if (engine.renderingEngine.isPointInTextElement(mouse, elem)) {
          engine.renderingEngine.showTextOverlay(canvas, elem, elemIndex, () =>
            engine.renderingEngine.requestRedraw()
          );
          break;
        }
      }
    });
  }, 'Unhandled text drag handlers initialization error.');
}
