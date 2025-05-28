// File: frontend/src/app/features/canvas/index.ts

import type { CanvasRefs, DOMElements, Services } from '../../types/index.js';

// ================================================== //
// ================================================== //

function clearCanvas(ctx: CanvasRenderingContext2D, services: Services): void {
  const { errors } = services;
  errors.handleSync(() => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }, 'Unhandled canvas clear error.');
}

// ================================================== //

function getCanvasRefs(elements: DOMElements, services: Services): CanvasRefs | void {
  const canvas = elements.canvas;
  const { errors } = services;

  errors.handleSync(() => {
    if (!canvas) throw new Error('Canvas element not found!');

    const ctx = canvas.getContext('2d');

    if (!ctx)
      throw new Error(`2D context not supported or the canvas is not available/initialized!`);

    return { canvas, ctx };
  }, 'Canvas Initialization Error');
}

// ================================================== //

function resizeCanvasToParent(canvas: DOMElements['canvas'], services: Services): void {
  const { errors } = services;
  errors.handleSync(() => {
    if (!canvas) throw new Error('Canvas element not found!');

    const parent = canvas.parentElement;
    if (!parent) throw new Error('Canvas has no parent element!');

    const rect = parent.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    // set actual bitmap size
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);

    // set display size
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
  }, 'Unhandled canvas resize error!');
}

// ================================================== //
// ================================================== //

export { clearCanvas, getCanvasRefs, resizeCanvasToParent };
