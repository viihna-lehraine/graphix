// File: frontend/src/app/features/engine/RenderingManager.ts

import type {
  CanvasResizeOptions,
  CanvasState,
  Core,
  Data,
  Layer,
  RedrawPlugin,
  Services,
  RenderingManagerContract,
  TextLayerElement,
  Utilities
} from '../../types/index.js';
import { AnimationGroupManager } from '@engine/AnimationGroupManager.js';
import { StateManager } from '@core/services/state/StateManager.js';

export class RenderingManager implements RenderingManagerContract {
  static #instance: RenderingManager | null = null;

  #devMode: Data['flags']['devMode'];
  #redrawPlugins: RedrawPlugin[] = [];

  #ctx: CanvasRenderingContext2D | null = null;

  #core: Core;
  #animationGroupManager: AnimationGroupManager;
  #data: Data;
  #errors: Services['errors'];
  #stateManager: StateManager;
  #utils: Utilities;

  private constructor(
    ctx: CanvasRenderingContext2D,
    core: Core,
    animationGroupManager: AnimationGroupManager
  ) {
    this.#ctx = ctx;
    this.#core = core;
    this.#data = core.data;
    this.#utils = core.utils;
    this.#devMode = core.data.flags.devMode;
    this.#errors = core.services.errors;
    this.#stateManager = core.services.stateManager;

    this.#animationGroupManager = animationGroupManager;

    this.#stateManager.subscribeToCanvasState(() => {
      this.requestRedraw();
    });
  }

  static getInstance(
    ctx: CanvasRenderingContext2D,
    core: Core,
    animationGroupManager: AnimationGroupManager
  ): RenderingManager {
    return core.services.errors.handleSync(() => {
      console.debug(`calling getInstance()...`);

      if (!RenderingManager.#instance) {
        console.debug(`No existing instance found. Creating new instance.`);

        RenderingManager.#instance = new RenderingManager(
          ctx,
          core,
          animationGroupManager
        );
      }

      return RenderingManager.#instance;
    }, 'Failed to get instance.');
  }

  addRedrawPlugin(plugin: RedrawPlugin): void {
    return this.#errors.handleSync(() => {
      this.#redrawPlugins.push(plugin);
    }, 'Failed to add redraw plugin.');
  }

  attachImageOnLoadHandler(state: CanvasState): void {
    this.#render(state);
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
      resize();
      window.addEventListener('resize', resize);

      return () => window.removeEventListener('resize', resize);
    }, 'Unhandled canvas auto-resize error.');
  }

  clearCanvas(ctx: CanvasRenderingContext2D): void {
    return this.#errors.handleSync(() => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }, 'Unhandled canvas clear error.');
  }

  drawBoundary(ctx: CanvasRenderingContext2D): void {
    return this.#errors.handleSync(() => {
      ctx.save();
      ctx.lineWidth = 8;
      ctx.strokeStyle = this.#core.data.config.defaults.boundaryStrokeStyle;
      ctx.setLineDash(this.#core.data.config.defaults.lineDash);
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
    }, '/*  */Failed to draw dev overlay.');
  }

  drawFullBackgroundImage(
    img: HTMLImageElement,
    canvas?: HTMLCanvasElement
  ): void {
    const ctx = this.#ctx;
    if (!ctx) return;

    const targetCanvas = canvas ?? ctx.canvas;
    this.#drawImagePreserveAspect(
      ctx,
      img,
      targetCanvas.width,
      targetCanvas.height
    );
  }

  drawResizeHandle(ctx: CanvasRenderingContext2D, x: number, y: number): void {
    ctx.save();
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.rect(x - 5, y - 5, 10, 10);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  getContext(): CanvasRenderingContext2D | null {
    return this.#ctx;
  }

  getMousePositionFromEvent(
    canvas: HTMLCanvasElement,
    evt: MouseEvent
  ): { x: number; y: number } {
    return this.#getMousePosition(canvas, evt);
  }

  getNthTextElement(n: number): { layer: Layer; elemIndex: number } | null {
    return this.#findNthTextElement(n);
  }

  getTextElements(): {
    elem: TextLayerElement;
    layerIndex: number;
    elemIndex: number;
  }[] {
    const layers = this.#stateManager.getCanvas().layers;
    const results: {
      elem: TextLayerElement;
      layerIndex: number;
      elemIndex: number;
    }[] = [];

    layers.forEach((layer, layerIndex) => {
      if (
        this.#utils.typeguards.isImageLayer(layer) &&
        layer.element.kind === 'text'
      ) {
        results.push({
          elem: layer.element,
          layerIndex,
          elemIndex: 0
        });
      }
    });

    return results;
  }

  isOverTextResizeHandle(
    mouse: { x: number; y: number },
    elem: TextLayerElement
  ): boolean {
    const ctx = this.getContext();
    if (!ctx) return false;
    return this.#isOverResizeHandle(mouse, elem, ctx);
  }

  isPointInTextElement(
    mouse: { x: number; y: number },
    elem: TextLayerElement
  ): boolean {
    const ctx = this.getContext();
    if (!ctx) return false;
    return this.#isPointInText(mouse, elem, ctx);
  }

  makeAnimationTick(
    animationGroupManager: AnimationGroupManager,
    stateManager: StateManager
  ): (now: number) => void {
    let lastTimestamp = performance.now();

    const animationTick = (now: number): void => {
      const deltaTime = (now - lastTimestamp) / 1000;
      lastTimestamp = now;

      const canvasState = stateManager.getCanvas();

      for (const layer of canvasState.layers) {
        if (
          layer.kind === 'image' &&
          layer.element.kind === 'animated_image' &&
          Array.isArray(layer.element.gifFrames) &&
          layer.element.gifFrames.length > 0
        ) {
          const elem = layer.element;
          const frame = elem.gifFrames[elem.currentFrame];

          elem.frameElapsed += deltaTime;

          if (frame && elem.frameElapsed >= frame.delay) {
            elem.currentFrame = (elem.currentFrame + 1) % elem.gifFrames.length;
            elem.frameElapsed = 0;
          }
        }
      }

      animationGroupManager.update(deltaTime);
      this.requestRedraw();

      requestAnimationFrame(animationTick);
    };

    return animationTick;
  }

  removeRedrawPlugin(plugin: RedrawPlugin): void {
    return this.#errors.handleSync(() => {
      this.#redrawPlugins = this.#redrawPlugins.filter(fn => fn !== plugin);
    }, 'Failed to remove redraw plugin.');
  }

  renderLayersToContext(ctx: CanvasRenderingContext2D, layers: Layer[]): void {
    this.#drawVisualLayersToContext(ctx, layers);
  }

  requestRedraw(): void {
    this.#errors.handleSync(() => {
      if (!this.#ctx) return;

      const ctx = this.#ctx;
      const state = this.#stateManager.getCanvas();

      this.clearCanvas(ctx);
      this.drawBoundary(ctx);
      this.#drawVisualLayersToContext(ctx, state.layers);
      this.#drawTextAndSelection(ctx, state.layers, state.selectedLayerIndex);

      for (const plugin of this.#redrawPlugins) {
        plugin(ctx, this.#core);
      }
    }, 'Failed to request redraw.');
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

  setCanvasToBackgroundImage(
    canvas: HTMLCanvasElement,
    img: HTMLImageElement,
    maxWidth: number = window.innerWidth,
    maxHeight: number = window.innerHeight
  ): void {
    this.#setCanvasToBackgroundImage(canvas, img, maxWidth, maxHeight);
  }

  showTextOverlay(
    canvas: HTMLCanvasElement,
    elem: TextLayerElement,
    index: number,
    redraw: () => void
  ): void {
    this.#showTextElementOverlay(canvas, elem, index, this.#core, redraw);
  }

  syncCanvasBackgroundFromImage(
    canvas: HTMLCanvasElement,
    img: HTMLImageElement
  ): void {
    this.#setCanvasToBackgroundImage(canvas, img);
  }

  // ==================================================== //
  // PRIVATE METHODS //

  #drawImagePreserveAspect(
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    canvasWidth: number,
    canvasHeight: number
  ): void {
    const imgAspect = img.width / img.height;
    const canvasAspect = canvasWidth / canvasHeight;

    let drawWidth, drawHeight, offsetX, offsetY;

    if (imgAspect > canvasAspect) {
      drawWidth = canvasWidth;
      drawHeight = canvasWidth / imgAspect;
      offsetX = 0;
      offsetY = (canvasHeight - drawHeight) / 2;
    } else {
      drawHeight = canvasHeight;
      drawWidth = canvasHeight * imgAspect;
      offsetX = (canvasWidth - drawWidth) / 2;
      offsetY = 0;
    }

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  }

  #drawTextAndSelection(
    ctx: CanvasRenderingContext2D,
    layers: Layer[],
    selectedLayerIndex: number | null
  ): void {
    return this.#errors.handleSync(() => {
      // 1. Draw text for all text layers (no handles here)
      for (const layer of layers) {
        if (
          layer.kind === 'image' &&
          this.#utils.typeguards.isImageLayer(layer)
        ) {
          const elem = layer.element;
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

      // 2. draw selection rectangle & resize handle ONLY for selected layer
      if (selectedLayerIndex !== null) {
        const layer = layers[selectedLayerIndex];
        ctx.save();
        ctx.strokeStyle = '#00F6';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 2]);
        ctx.strokeRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.restore();

        if (this.#core.utils.typeguards.isImageLayer(layer)) {
          const elem = layer.element;

          if (
            (elem.kind === 'static_image' || elem.kind === 'animated_image') &&
            !elem.element
          ) {
            const img = new window.Image();
            img.src = elem.asset.src;
            elem.element = img;
          }

          // TEXT HANDLE
          if (elem.kind === 'text') {
            const fontSize = elem.fontSize ?? 32;
            this.drawResizeHandle(
              ctx,
              elem.position.x + fontSize,
              elem.position.y
            );
          }

          // STATIC IMAGE HANDLE
          if (elem.kind === 'static_image' && elem.element) {
            const img = elem.element as HTMLImageElement;
            this.drawResizeHandle(
              ctx,
              elem.position.x + img.width * elem.scale.x,
              elem.position.y + img.height * elem.scale.y
            );
          }

          // ANIMATED IMAGE HANDLE
          if (elem.kind === 'animated_image' && elem.element) {
            const img = elem.element as HTMLImageElement;
            this.drawResizeHandle(
              ctx,
              elem.position.x + img.width * elem.scale.x,
              elem.position.y + img.height * elem.scale.y
            );
          }
        }
      }
    }, 'Unhandled canvas text and selection drawing error.');
  }

  #drawVisualLayersToContext(
    ctx: CanvasRenderingContext2D,
    layers: Layer[]
  ): void {
    layers
      .slice()
      .sort((a, b) => a.zIndex - b.zIndex)
      .forEach(layer => {
        if (!layer.visible) return;

        ctx.save();
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = layer.opacity;

        switch (layer.kind) {
          case 'background': {
            const elem = layer.element;
            if (
              (elem.kind === 'static_image' ||
                elem.kind === 'animated_image') &&
              elem.element &&
              elem.element.complete &&
              elem.element.naturalWidth > 0
            ) {
              this.#drawImagePreserveAspect(
                ctx,
                elem.element,
                ctx.canvas.width,
                ctx.canvas.height
              );
            }
            break;
          }

          case 'image':
            const elem = layer.element;
            ctx.save();
            ctx.translate(elem.position.x, elem.position.y);

            let rotation = 0;
            if (elem.kind === 'static_image' || elem.kind === 'text') {
              rotation = typeof elem.rotation === 'number' ? elem.rotation : 0;
            } else if (elem.kind === 'animated_image') {
              if (
                elem.rotation &&
                typeof elem.rotation === 'object' &&
                'currentAngle' in elem.rotation
              ) {
                rotation = elem.rotation.currentAngle ?? 0;
              } else {
                rotation = 0;
              }
            }
            ctx.rotate((rotation * Math.PI) / 180);
            ctx.scale(elem.scale.x, elem.scale.y);

            if (
              elem.kind === 'static_image' &&
              elem.element &&
              elem.element.complete &&
              elem.element.naturalWidth > 0
            ) {
              ctx.drawImage(elem.element, 0, 0);
            } else if (
              elem.kind === 'animated_image' &&
              Array.isArray(elem.gifFrames) &&
              elem.gifFrames.length > 0
            ) {
              const frame = elem.gifFrames[elem.currentFrame];

              if (frame && frame.imageData) {
                ctx.putImageData(frame.imageData, 0, 0);
              }
            }

            ctx.restore();
            break;

          case 'overlay': {
            const elem = layer.element;

            if (
              (elem.kind === 'static_image' ||
                elem.kind === 'animated_image') &&
              elem.element &&
              elem.element.complete &&
              elem.element.naturalWidth > 0
            ) {
              this.#drawImagePreserveAspect(
                ctx,
                elem.element,
                ctx.canvas.width,
                ctx.canvas.height
              );
            }
            break;
          }
        }

        ctx.restore();
      });

    ctx.globalAlpha = 1.0;
    ctx.globalCompositeOperation = 'source-over';
  }

  #findNthTextElement(n: number): { layer: Layer; elemIndex: number } | null {
    const layers = this.#stateManager.getCanvas().layers;
    let count = 0;

    for (const layer of layers) {
      if (
        this.#utils.typeguards.isImageLayer(layer) &&
        layer.element.kind === 'text'
      ) {
        if (count === n) return { layer, elemIndex: 0 };
        count++;
      }
    }
    return null;
  }

  #getMousePosition(
    canvas: HTMLCanvasElement,
    evt: MouseEvent
  ): {
    x: number;
    y: number;
  } {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (evt.clientX - rect.left) * scaleX,
      y: (evt.clientY - rect.top) * scaleY
    };
  }

  #isOverResizeHandle(
    mouse: { x: number; y: number },
    elem: TextLayerElement,
    ctx: CanvasRenderingContext2D
  ): boolean {
    const fontSize = elem.fontSize ?? 32;
    const fontWeight = elem.fontWeight ?? 'bold';
    const fontFamily = elem.fontFamily ?? 'sans-serif';
    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;

    const width = ctx.measureText(elem.text).width;
    const height = fontSize;

    const handleSize = 10;
    const handleX = elem.position.x + width / 2 - handleSize / 2;
    const handleY = elem.position.y + height / 2 - handleSize / 2;

    return (
      mouse.x >= handleX &&
      mouse.x <= handleX + handleSize &&
      mouse.y >= handleY &&
      mouse.y <= handleY + handleSize
    );
  }

  #isPointInText(
    pt: { x: number; y: number },
    elem: TextLayerElement,
    ctx: CanvasRenderingContext2D
  ): boolean {
    ctx.save();

    const fontSize = elem.fontSize ?? 32;
    const fontWeight = elem.fontWeight ?? 'bold';
    const fontFamily = elem.fontFamily ?? 'sans-serif';
    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;

    const width = ctx.measureText(elem.text).width;
    const height = fontSize;
    ctx.restore();

    return (
      pt.x >= elem.position.x - width / 2 &&
      pt.x <= elem.position.x + width / 2 &&
      pt.y >= elem.position.y - height / 2 &&
      pt.y <= elem.position.y + height / 2
    );
  }

  #prepCanvasHiDPI(ctx: CanvasRenderingContext2D): void {
    const dpr = window.devicePixelRatio || 1;
    // makes coordinates match CSS pixels; keep images sharp
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  #render(state: CanvasState = this.#stateManager.getCanvas()): void {
    return this.#errors.handleSync(() => {
      this.clearCanvas(this.#ctx!);

      if (this.#devMode) this.drawDevOverlay();

      this.drawBoundary(this.#ctx!);

      if (state.layers.length > 0) {
        this.#drawVisualLayersToContext(this.#ctx!, state.layers);
      }

      this.#drawTextAndSelection(
        this.#ctx!,
        state.layers,
        state.selectedLayerIndex
      );
      for (const plugin of this.#redrawPlugins) {
        plugin(this.#ctx!, this.#core);
      }
    }, 'Failed to render canvas.');
  }

  #removeExistingOverlay(className: string): void {
    document.querySelectorAll(`.${className}`).forEach(e => e.remove());
  }

  #resizeCanvasToMatchImage(
    canvas: HTMLCanvasElement,
    img: HTMLImageElement
  ): void {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = img.width * dpr;
    canvas.height = img.height * dpr;
    canvas.style.width = img.width + 'px';
    canvas.style.height = img.height + 'px';
    const ctx = this.getContext();

    if (!ctx) {
      throw new Error('Canvas 2D context unavailable');
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  #setCanvasHiDPISize(
    canvas: HTMLCanvasElement,
    cssWidth: number,
    cssHeight: number
  ): void {
    const dpr = window.devicePixelRatio || 1;

    // set physical bitmap size for HiDPI displays
    canvas.width = cssWidth * dpr;
    canvas.height = cssHeight * dpr;

    // set the CSS size (on-screen size in pixels)
    canvas.style.width = `${cssWidth}px`;
    canvas.style.height = `${cssHeight}px`;
  }

  #setCanvasToBackgroundImage(
    canvas: HTMLCanvasElement,
    img: HTMLImageElement,
    maxWidth: number = window.innerWidth,
    maxHeight: number = window.innerHeight
  ): void {
    const dpr = window.devicePixelRatio || 1;
    const imgAspect = img.width / img.height;
    const maxAspect = maxWidth / maxHeight;

    let drawWidth, drawHeight;

    if (imgAspect > maxAspect) {
      drawWidth = Math.min(img.width, maxWidth);
      drawHeight = drawWidth / imgAspect;
    } else {
      drawHeight = Math.min(img.height, maxHeight);
      drawWidth = drawHeight * imgAspect;
    }

    drawWidth = Math.round(drawWidth);
    drawHeight = Math.round(drawHeight);

    canvas.width = drawWidth * dpr;
    canvas.height = drawHeight * dpr;
    canvas.style.width = `${drawWidth}px`;
    canvas.style.height = `${drawHeight}px`;

    // set crisp drawing
    const ctx = canvas.getContext('2d')!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // draw the background as a 1:1 mapping
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, drawWidth, drawHeight);
  }

  #showTextElementOverlay(
    canvas: HTMLCanvasElement,
    elem: TextLayerElement,
    index: number,
    core: Core,
    redraw: () => void
  ): void {
    const className = core.data.dom.classes.textEditOverlay;
    this.#removeExistingOverlay(className);

    // canvas/text position calc
    const rect = canvas.getBoundingClientRect();
    const ctx = this.getContext();
    if (!ctx) return;
    ctx.font = `${elem.fontWeight ?? 'bold'} ${elem.fontSize ?? 32}px ${elem.fontFamily ?? 'sans-serif'}`;
    const width = ctx.measureText(elem.text).width + 16;
    const height = (elem.fontSize ?? 32) + 8;
    const x =
      rect.left + elem.position.x * (rect.width / canvas.width) - width / 2;
    const y =
      rect.top + elem.position.y * (rect.height / canvas.height) - height / 2;

    // overlay
    const overlay = document.createElement('div');
    overlay.className = className;
    Object.assign(overlay.style, {
      position: 'absolute',
      left: `${x}px`,
      top: `${y + height + 10}px`, // below the text
      zIndex: '10000',
      padding: '12px',
      background: 'rgba(255,255,255,0.97)',
      border: '1.5px solid #b4b4b4',
      borderRadius: '8px',
      boxShadow: '0 2px 14px #0003',
      minWidth: '220px'
    });

    // text input
    const textInput = document.createElement('input');
    textInput.type = 'text';
    textInput.value = elem.text;
    textInput.style.width = '100%';

    // font select
    const fontSelect = document.createElement('select');
    fontSelect.className = core.data.dom.classes.fontSelector;
    ['Arial', 'Impact', 'Comic Sans MS', 'Times New Roman'].forEach(f => {
      const opt = document.createElement('option');
      opt.value = f;
      opt.text = f;
      if (elem.fontFamily === f) opt.selected = true;
      fontSelect.appendChild(opt);
    });

    // size input
    const sizeInput = document.createElement('input');
    sizeInput.type = 'number';
    sizeInput.min = '8';
    sizeInput.max = '200';
    sizeInput.value = String(elem.fontSize);

    // color input
    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.value = elem.color;

    // save/cancel buttons
    const saveBtn = document.createElement('button');
    saveBtn.innerText = 'Done';
    saveBtn.type = 'button';
    const cancelBtn = document.createElement('button');
    cancelBtn.innerText = 'Cancel';
    cancelBtn.type = 'button';
    cancelBtn.style.marginLeft = '8px';

    // form layout
    overlay.append(
      'Text:',
      document.createElement('br'),
      textInput,
      document.createElement('br'),
      'Font:',
      document.createElement('br'),
      fontSelect,
      document.createElement('br'),
      'Size:',
      document.createElement('br'),
      sizeInput,
      document.createElement('br'),
      'Color:',
      document.createElement('br'),
      colorInput,
      document.createElement('br'),
      saveBtn,
      cancelBtn
    );

    const manager = this;

    saveBtn.addEventListener('click', (e?: Event) => {
      if (e) e.preventDefault();
      commitEdit(index, overlay, redraw, core, manager);
    });
    cancelBtn.addEventListener('click', () => cancelEdit(overlay, redraw));
    overlay.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Escape') cancelEdit(overlay, redraw);
      if (e.key === 'Enter') commitEdit(index, overlay, redraw, core, manager);
    });

    setTimeout(() => textInput.focus(), 20); // focus logic
    document.body.appendChild(overlay); // attach to DOM
  }

  /**
   * Internal method to reference otherwise-unused private helpers
   * that are expected to be reactivated in future rendering features.
   */
  _(): void {
    // explicit no-op references to suppress TS6133 unused warnings
    const _animationGroupManager = this.#animationGroupManager;
    void this.#prepCanvasHiDPI;
    void this.#resizeCanvasToMatchImage;
    void this.#setCanvasHiDPISize;
    void this.#setCanvasToBackgroundImage;
    console.log(`NO-OP FN FOR TESTING PURPOSES: ${_animationGroupManager}`);
  }
}

// =================================================== //
// =================================================== //

function commitEdit(
  index: number,
  overlay: HTMLDivElement,
  redraw: () => void,
  core: Core,
  renderingManager: RenderingManager
): void {
  core.services.stateManager.updateTextElement(index, renderingManager);
  overlay.remove();
  redraw();
}

function cancelEdit(overlay: HTMLDivElement, redraw: () => void): void {
  overlay.remove();
  redraw();
}
