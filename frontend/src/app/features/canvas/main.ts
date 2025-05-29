// File: frontend/src/app/features/canvas/main.ts

import type {
  CanvasFunctions,
  CanvasRefs,
  Data,
  Services
} from '../../types/index.js';

// ================================================== //
// ================================================== //

function clearCanvas(ctx: CanvasRenderingContext2D, services: Services): void {
  const { errors } = services;
  errors.handleSync(() => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }, 'Unhandled canvas clear error.');
}

// ================================================== //

function drawBoundary(ctx: CanvasRenderingContext2D, services: Services): void {
  const { errors } = services;

  return errors.handleSync(() => {
    ctx.save();
    ctx.lineWidth = 8;
    ctx.strokeStyle = '#ff80c5ff';
    ctx.setLineDash([12, 10]);
    ctx.strokeRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.restore();
  }, 'Unhandled canvas boundary drawing error.');
}

// ================================================== //

function get2DContext(
  canvas: HTMLCanvasElement,
  services: Services
): CanvasRenderingContext2D {
  const { errors } = services;

  return errors.handleSync(() => {
    const ctx = canvas.getContext('2d');

    if (!ctx) throw new Error('2D canvas context is not available!');

    return ctx;
  }, 'Unhandled canvas context retrieval error.');
}

// ================================================== //

function getCanvasRefs(data: Data, services: Services): CanvasRefs {
  const { errors } = services;

  return errors.handleSync(() => {
    const canvas = data.dom.elements.canvas;
    if (!canvas) throw new Error('Canvas element not found!');

    const ctx = canvas.getContext('2d');

    if (!ctx)
      throw new Error(
        `2D context not supported or the canvas is not available/initialized!`
      );

    return { canvas, ctx };
  }, 'Unhandled canvas reference retrieval error.');
}

// ================================================== //

function getMainCanvas(data: Data, services: Services): HTMLCanvasElement {
  const { errors } = services;

  return errors.handleSync(() => {
    const canvas = data.dom.elements.canvas;

    if (!canvas) throw new Error('Main canvas element not found!');

    return canvas;
  }, 'Unhandled main canvas retrieval error.');
}

// ================================================== //

function resizeCanvasToParent(data: Data, services: Services): void {
  const { errors } = services;

  return errors.handleSync(() => {
    const canvas = document.getElementById(
      data.dom.ids.canvas
    ) as HTMLCanvasElement | null;
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
  }, 'Unhandled canvas resize error.');
}

// ================================================== //
// ================================================== //

export const mainCanvasFns: CanvasFunctions['main'] = {
  clearCanvas,
  drawBoundary,
  get2DContext,
  getCanvasRefs,
  getMainCanvas,
  resizeCanvasToParent
} as const;
