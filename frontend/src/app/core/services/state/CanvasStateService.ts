// File: frontend/src/app/core/services/state/CanvasStateService.ts

import type {
  Asset,
  CanvasState,
  CanvasStateServiceContract,
  Data,
  GifAnimation,
  Layer,
  LayerElement,
  Services,
  Subscriber,
  TextLayerElement,
  Utilities
} from '../../../types/index.js';

// ================================================== //
// ================================================== //

export class CanvasStateService implements CanvasStateServiceContract {
  static #instance: CanvasStateService | null = null;

  #canvasState: CanvasState;
  #subscribers: Set<Subscriber<CanvasState>>;

  #history: CanvasState[];
  #future: CanvasState[];

  #data: Data;
  #log: Services['log'];
  #utils: Utilities;

  // ================================================= //

  private constructor(
    initial: CanvasState,
    data: Data,
    log: Services['log'],
    utils: Utilities
  ) {
    this.#log = log;
    this.#canvasState = { ...initial };
    this.#canvasState.layers = initial.layers || [];
    this.#canvasState.selectedLayerIndex = initial.selectedLayerIndex ?? null;

    this.#subscribers = new Set();
    this.#history = [];
    this.#future = [];

    this.#data = data;
    this.#log = log;
    this.#utils = utils;
  }

  // ================================================= //

  static getInstance(
    initial: CanvasState,
    data: Data,
    log: Services['log'],
    utils: Utilities
  ): CanvasStateService {
    try {
      if (!CanvasStateService.#instance) {
        CanvasStateService.#instance = new CanvasStateService(
          initial,
          data,
          log,
          utils
        );
      }

      return CanvasStateService.#instance;
    } catch (error) {
      throw new Error(
        `Failed to get CanvasStateService instance: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  // ================================================= //

  addLayer(layer: Layer): void {
    this.#history.push({ ...this.#canvasState });
    this.#canvasState.layers.push(layer);
    this.#notify();
  }

  addTextElement(elem: TextLayerElement): void {
    // find any layer that contains at least one text element
    let textLayer = this.#canvasState.layers.find(layer =>
      layer.elements.some(e => e.kind === 'text')
    );

    if (!textLayer) {
      // if no text layer, create a new layer with just this text element
      textLayer = {
        id: crypto.randomUUID(),
        name: 'Text Layer',
        opacity: 1,
        visible: true,
        zIndex: this.#canvasState.layers.length,
        blendMode: 'normal',
        elements: [elem]
      };
      this.#canvasState.layers.push(textLayer);
    } else {
      // push into existing layer's elements
      textLayer.elements.push(elem);
    }

    this.#notify();
  }

  canRedo(): boolean {
    return this.#future.length > 0;
  }

  canUndo(): boolean {
    return this.#history.length > 0;
  }

  clearAll(): void {
    this.#history.push({ ...this.#canvasState });
    this.#canvasState.layers = [];
    this.#canvasState.selectedLayerIndex = null;
    this.#notify();
  }

  clearAnimation(): void {
    this.setAnimation(null);
  }

  get(): CanvasState {
    return { ...this.#canvasState };
  }

  getAspectRatio(): number | undefined {
    return this.#canvasState.aspectRatio;
  }

  getLayers(): Layer[] {
    return [...this.#canvasState.layers];
  }

  getSelectedLayerIndex(): number | null {
    return this.#canvasState.selectedLayerIndex;
  }

  moveLayer(index: number, newIndex: number): void {
    const [moved] = this.#canvasState.layers.splice(index, 1);
    this.#canvasState.layers.splice(newIndex, 0, moved);
    this.#notify();
  }

  moveTextElement(
    layerIndex: number,
    elemIndex: number,
    x: number,
    y: number
  ): void {
    const layer = this.#canvasState.layers[layerIndex];
    if (!layer) return;

    const elem = layer.elements[elemIndex];
    if (elem && elem.kind === 'text') {
      elem.position.x = x;
      elem.position.y = y;
      this.#notify();
    }
  }

  redo(): void {
    if (this.#future.length > 0) {
      this.#history.push({ ...this.#canvasState });
      this.#canvasState = this.#future.pop()!;
      this.#notify();
    }
  }

  removeLayer(index: number): void {
    this.#history.push({ ...this.#canvasState });
    this.#canvasState.layers.splice(index, 1);
    this.#notify();
  }

  removeTextElement(layerIndex: number, elemIndex: number): void {
    const layer = this.#canvasState.layers[layerIndex];
    if (!layer) return;
    if (layer.elements[elemIndex]?.kind !== 'text') {
      this.#log.warn(
        `Attempted to remove non-text element at index ${elemIndex} in layer ${layerIndex} but failed. The element is not a text element or does not exist.`
      );
      return;
    }
    layer.elements.splice(elemIndex, 1);
    this.#notify();
  }

  reset() {
    this.set(
      this.#data.config.defaults.canvasWidth,
      this.#data.config.defaults.canvasHeight
    );
  }

  set(width: number, height: number): void {
    this.#history.push({ ...this.#canvasState });
    this.#future = [];
    this.#canvasState.width = width;
    this.#canvasState.height = height;
    this.#notify();
  }

  setAnimation(anim: GifAnimation | null): void {
    // remove any layer with an animated_image element
    this.#canvasState.layers = this.#canvasState.layers.filter(
      layer => !layer.elements.some(el => el.kind === 'animated_image')
    );

    if (anim) {
      const asset: Asset = {
        type: 'gif',
        name: 'GifAnimation',
        class: 'animated',
        src: '',
        ext: 'gif',
        tags: [],
        size_kb: 0,
        hash_sha256: '',
        credits: false,
        license: false,
        tileable: false,
        width: false,
        height: false,
        font: false,
        animation: {
          frames: {
            count: anim.frames.length,
            rate: 24 // TODO: readdress
          },
          rotation: false
        }
      };

      const gifElement: LayerElement = {
        kind: 'animated_image',
        id: crypto.randomUUID(),
        asset,
        position: { x: 0, y: 0 },
        scale: { x: 1, y: 1 },
        rotation: false,
        gifFrames: anim.frames,
        currentFrame: 0,
        frameElapsed: 0,
        element: null
      };

      const gifLayer: Layer = {
        id: crypto.randomUUID(),
        name: 'GIF Layer',
        opacity: 1,
        visible: true,
        zIndex: this.#canvasState.layers.length,
        blendMode: 'normal',
        elements: [gifElement]
      };

      this.#canvasState.layers.push(gifLayer);
    }

    this.#notify();
  }

  setAspectRatio(aspect: number | undefined): void {
    this.#canvasState.aspectRatio = aspect;
    this.#notify();
  }

  setCanvasImage(imageDataUrl: string | undefined): void {
    if (imageDataUrl) {
      const img = new Image();
      img.src = imageDataUrl;

      const asset: Asset = {
        type: 'image',
        name: 'ImageLayer',
        class: 'static',
        src: imageDataUrl,
        ext: 'png',
        tags: [],
        size_kb: 0,
        hash_sha256: '',
        credits: false,
        license: false,
        tileable: false,
        width: false,
        height: false,
        font: false,
        animation: false
      };

      const imageElement: LayerElement = {
        kind: 'static_image',
        id: crypto.randomUUID(),
        asset,
        position: { x: 0, y: 0 },
        scale: { x: 1, y: 1 },
        rotation: 0,
        element: img
      };

      const imageLayer: Layer = {
        id: crypto.randomUUID(),
        name: 'Image Layer',
        opacity: 1,
        visible: true,
        zIndex: this.#canvasState.layers.length,
        blendMode: 'normal',
        elements: [imageElement]
      };

      this.#canvasState.layers.push(imageLayer);
    }

    this.#notify();
  }

  setSelectedLayerIndex(index: number | null): void {
    this.#canvasState.selectedLayerIndex = index;
    this.#notify();
  }

  subscribe(fn: Subscriber<CanvasState>) {
    this.#subscribers.add(fn);
    fn(this.get());
    return () => this.#subscribers.delete(fn);
  }

  undo(): void {
    if (this.#history.length > 0) {
      this.#future.push({ ...this.#canvasState });
      this.#canvasState = this.#history.pop()!;
      this.#notify();
    }
  }

  updateLayer(index: number, newLayer: Layer): void {
    this.#canvasState.layers[index] = newLayer;
    this.#notify();
  }

  updateTextElement(
    globalTextElemIndex: number,
    newElem: TextLayerElement
  ): void {
    const found = this.#utils.canvas.findNthTextElement(
      this.#canvasState.layers,
      globalTextElemIndex
    );
    if (!found) return;
    found.layer.elements[found.elemIndex] = newElem;
    this.#notify();
  }

  // ================================================= //

  #notify(): void {
    const state = this.get();
    for (const fn of this.#subscribers) fn(state);
  }
}
