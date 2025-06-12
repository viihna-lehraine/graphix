// File: frontend/src/app/features/engine/RenderingEngine.ts

import type {
  CanvasResizeOptions,
  CanvasState,
  Core,
  Data,
  Helpers,
  Layer,
  RedrawPlugin,
  Services,
  RenderingEngineContract,
  Utilities
} from '../../types/index.js';

// ====================================================== //
// ====================================================== //

export class RenderingEngine implements RenderingEngineContract {
  static #instance: RenderingEngine | null = null;

  #data: Data;
  #devMode: Data['flags']['devMode'];
  #redrawPlugins: RedrawPlugin[] = [];

  #ctx: CanvasRenderingContext2D | null = null;

  #core: Core;
  #errors: Services['errors'];
  #helpers: Helpers;
  #log: Services['log'];
  #stateManager: Services['stateManager'];
  #utils: Utilities;

  // ==================================================== //

  private constructor(ctx: CanvasRenderingContext2D, core: Core) {
    const {
      data,
      helpers,
      services: { errors, log, stateManager },
      utils
    } = core;

    this.#ctx = ctx;

    this.#core = core;

    this.#data = data;
    this.#helpers = helpers;
    this.#utils = utils;

    this.#devMode = data.flags.devMode;
    this.#errors = errors;
    this.#log = log;
    this.#stateManager = stateManager;

    this.#stateManager.subscribeToCanvas(() => {
      this.render();
    });
  }

  // ==================================================== //

  static getInstance(
    ctx: CanvasRenderingContext2D,
    core: Core
  ): RenderingEngine {
    const { errors, log } = core.services;
    return errors.handleSync(() => {
      log.info(`RENDERING_ENGINE: calling getInstance()...`);

      if (!RenderingEngine.#instance) {
        log.info(
          `RENDERING_ENGINE: No existing instance found. Creating new instance.`
        );
        RenderingEngine.#instance = new RenderingEngine(ctx, core);
      }

      return RenderingEngine.#instance;
    }, 'RENDERING_ENGINE: Failed to get instance.');
  }

  // ==================================================== //

  render(state: CanvasState = this.#stateManager.getCanvas()): void {
    return this.#errors.handleSync(() => {
      // 1. clear the canvas
      this.clearCanvas(this.#ctx!);

      // 2. draw dev overlays
      if (this.#devMode) this.drawDevOverlay();

      // 3. draw main boundary
      this.drawBoundary(this.#ctx!);

      // 4. draw all layers (z-index, blend mode, etc.)
      if (state.layers.length > 0) {
        this.#utils.canvas.drawVisualLayersToContext(this.#ctx!, state.layers);
      }
      // 5. draw text and selection overlays
      this.#drawTextAndSelection(
        this.#ctx!,
        state.layers,
        state.selectedLayerIndex
      );

      // 6. run redraw plugins
      for (const plugin of this.#redrawPlugins) {
        plugin(this.#ctx!, this.#core);
      }
    }, 'RENDERING_ENGINE: Failed to render canvas.');
  }

  // ==================================================== //

  addRedrawPlugin(plugin: RedrawPlugin): void {
    return this.#errors.handleSync(() => {
      this.#redrawPlugins.push(plugin);
    }, 'RENDERING_ENGINE: Failed to add redraw plugin.');
  }

  attachImageOnLoadHandler(state: CanvasState): void {
    this.render(state);
  }

  autoResize({
    canvas,
    container,
    preserveAspectRatio = true
  }: CanvasResizeOptions): () => void {
    return this.#errors.handleSync(() => {
      const resize = () => {
        const rect = container.getBoundingClientRect();

        if (preserveAspectRatio) {
          const aspect = canvas.width / canvas.height || 4 / 3;
          let width = rect.width;
          let height = rect.width / aspect;

          if (height > rect.height) {
            height = rect.height;
            width = rect.height * aspect;
          }

          canvas.style.width = `${width}px`;
          canvas.style.height = `${height}px`;
        } else {
          canvas.style.width = `${rect.width}px`;
          canvas.style.height = `${rect.height}px`;
        }
      };

      resize(); // initial resize call

      window.addEventListener('resize', resize);

      return () => window.removeEventListener('resize', resize);
    }, 'Unhandled canvas auto-resize error.');
  }

  clearCanvas(ctx: CanvasRenderingContext2D): void {
    return this.#errors.handleSync(() => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }, 'RENDERING_ENGINE: Unhandled canvas clear error.');
  }

  drawBoundary(ctx: CanvasRenderingContext2D): void {
    return this.#errors.handleSync(() => {
      ctx.save();
      ctx.lineWidth = 8;
      ctx.strokeStyle = '#ff80c5ff';
      ctx.setLineDash([12, 10]);
      ctx.strokeRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.restore();
    }, 'Unhandled canvas boundary drawing error.');
  }

  drawDevOverlay(): void {
    return this.#errors.handleSync(() => {
      // draw crosshairs (or whatever dev markers I want)
      this.#ctx!.save();
      this.#ctx!.strokeStyle = 'rgba(255,0,0,0.25)';
      this.#ctx!.lineWidth = 1;
      this.#ctx!.setLineDash([4, 4]);
      this.#ctx!.beginPath();
      this.#ctx!.moveTo(0, this.#ctx!.canvas.height / 2);
      this.#ctx!.lineTo(this.#ctx!.canvas.width, this.#ctx!.canvas.height / 2);
      this.#ctx!.moveTo(this.#ctx!.canvas.width / 2, 0);
      this.#ctx!.lineTo(this.#ctx!.canvas.width / 2, this.#ctx!.canvas.height);
      this.#ctx!.stroke();
      this.#ctx!.restore();
    }, 'RENDERING_ENGINE: Failed to draw dev overlay.');
  }

  redraw(ctx: CanvasRenderingContext2D, state: CanvasState): void {
    return this.#errors.handleSync(() => {
      this.clearCanvas(ctx);
      this.drawBoundary(ctx);
      this.#utils.canvas.drawVisualLayersToContext(ctx, state.layers);
      this.#drawTextAndSelection(ctx, state.layers, state.selectedLayerIndex);
    }, 'Unhandled canvas redraw error.');
  }

  removeRedrawPlugin(plugin: RedrawPlugin): void {
    return this.#errors.handleSync(() => {
      this.#redrawPlugins = this.#redrawPlugins.filter(fn => fn !== plugin);
    }, 'RENDERING_ENGINE: Failed to remove redraw plugin.');
  }

  renderTo(ctx: CanvasRenderingContext2D, state?: CanvasState): void {
    return this.#errors.handleSync(() => {
      const prev = this.#devMode;
      const origCtx = this.#ctx;
      this.#ctx = ctx;
      this.render(state);
      this.#ctx = origCtx;
      this.#devMode = prev;
    }, 'RENDERING_ENGINE: Failed to render to provided context.');
  }

  resizeCanvasToParent(): void {
    return this.#errors.handleSync(() => {
      const canvas = document.getElementById(
        this.#data.dom.ids.canvas
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

  // ==================================================== //
  // PRIVATE METHODS //

  #drawTextAndSelection(
    ctx: CanvasRenderingContext2D,
    layers: Layer[],
    selectedLayerIndex: number | null
  ): void {
    return this.#errors.handleSync(() => {
      for (const layer of layers) {
        for (const elem of layer.elements) {
          if (elem.kind === 'text') {
            ctx.save();
            const fontSize = elem.fontSize ?? 32;
            const fontWeight = elem.fontWeight ?? 'bold';
            const fontFamily = elem.fontFamily ?? 'sans-serif';
            ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
            ctx.fillStyle = elem.color;
            ctx.textAlign = elem.align;
            ctx.textBaseline = elem.baseline;
            ctx.fillText(elem.text, elem.position.x, elem.position.y);
            ctx.restore();
          }
        }
      }

      if (selectedLayerIndex !== null) {
        ctx.save();
        ctx.strokeStyle = '#00F6';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 2]);
        ctx.strokeRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.restore();
      }
    }, 'Unhandled canvas text and selection drawing error.');
  }

  // ==================================================== //

  _(): void {
    this.#data = this.#data;
    this.#errors = this.#errors;
    this.#helpers = this.#helpers;
    this.#log = this.#log;
    this.#utils = this.#utils;
  }
}
