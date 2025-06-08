// File: frontend/src/app/features/canvas/main.ts

import type {
  CanvasFunctions,
  CanvasRefs,
  CanvasState,
  Data,
  Services
} from '../../types/index.js';

// ================================================== //

function clearCanvas(ctx: CanvasRenderingContext2D, services: Services): void {
  const { errors } = services;
  errors.handleSync(() => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }, 'Unhandled canvas clear error.');
}

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

function getCanvasRefs(data: Data, services: Services): CanvasRefs {
  const { errors } = services;

  return errors.handleSync(() => {
    const canvas = document.getElementById(
      data.dom.ids.canvas
    ) as HTMLCanvasElement | null;
    if (!canvas) throw new Error('Canvas element not found!');

    const ctx = canvas.getContext('2d');

    if (!ctx)
      throw new Error(
        `2D context not supported or the canvas is not available/initialized!`
      );

    return { canvas, ctx };
  }, 'Unhandled canvas reference retrieval error.');
}

function getMainCanvas(data: Data, services: Services): HTMLCanvasElement {
  const { errors } = services;

  return errors.handleSync(() => {
    const canvas = document.getElementById(
      data.dom.ids.canvas
    ) as HTMLCanvasElement | null;
    if (!canvas) throw new Error('Main canvas element not found!');

    return canvas;
  }, 'Unhandled canvas retrieval error.');
}

function redrawCanvas(
  ctx: CanvasRenderingContext2D,
  state: CanvasState,
  services: Services
): void {
  clearCanvas(ctx, services);
  drawBoundary(ctx, services);

  for (const elem of state.textElements) {
    ctx.save();
    const fontSize = elem.fontSize ?? 32;
    const fontWeight = elem.fontWeight ?? 'bold';
    const fontFamily = elem.fontFamily ?? 'sans-serif';
    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    ctx.fillStyle = elem.color;
    ctx.textAlign = elem.align;
    ctx.textBaseline = elem.baseline;
    ctx.fillText(elem.text, elem.x, elem.y);
    ctx.restore();
  }

  if (state.selectedTextIndex !== null) {
    const elem = state.textElements[state.selectedTextIndex];

    // fallback font logic
    const fontFamily = elem.fontFamily ?? 'sans-serif';
    const fontSize = elem.fontSize ?? 32;
    const fontWeight = elem.fontWeight ?? 'bold';
    ctx.save();
    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;

    // measure text dimensions
    const width = ctx.measureText(elem.text).width ?? 32;
    const height = elem.fontSize ?? 32;

    // draw selection box
    ctx.strokeStyle = '#00F6';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 2]);
    ctx.strokeRect(elem.x - width / 2, elem.y - height / 2, width, height);

    // draw resize handle (bottom-right corner of the box)
    ctx.setLineDash([]);
    ctx.fillStyle = '#00F6';
    const handleSize = 10;
    ctx.fillRect(
      elem.x + width / 2 - handleSize / 2,
      elem.y + height / 2 - handleSize / 2,
      handleSize,
      handleSize
    );

    ctx.restore();
  }
}

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

export const mainCanvasFns: CanvasFunctions['main'] = {
  clearCanvas,
  drawBoundary,
  get2DContext,
  getCanvasRefs,
  getMainCanvas,
  redrawCanvas,
  resizeCanvasToParent
} as const;
