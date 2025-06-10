// File: frontend/src/app/core/services/state/CanvasStateService.ts

import type {
  CanvasState,
  CanvasStateServiceContract,
  Data,
  GifAnimation,
  Subscriber,
  TextElement,
  TextVisualLayer,
  VisualLayer
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

  // ================================================= //

  private constructor(initial: CanvasState, data: Data) {
    this.#canvasState = { ...initial };
    this.#canvasState.layers = initial.layers || [];
    this.#canvasState.selectedLayerIndex = initial.selectedLayerIndex ?? null;

    this.#subscribers = new Set();
    this.#history = [];
    this.#future = [];
    this.#data = data;
  }

  // ================================================= //

  static getInstance(initial: CanvasState, data: Data): CanvasStateService {
    try {
      if (!CanvasStateService.#instance) {
        CanvasStateService.#instance = new CanvasStateService(initial, data);
      }

      return CanvasStateService.#instance;
    } catch (error) {
      throw new Error(
        `Failed to get CanvasStateService instance: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  // ================================================= //

  addLayer(layer: VisualLayer): void {
    this.#history.push({ ...this.#canvasState });
    this.#canvasState.layers.push(layer);
    this.#notify();
  }

  addTextElement(elem: TextElement): void {
    let textLayer = this.#canvasState.layers.find(
      (layer): layer is TextVisualLayer => layer.type === 'text'
    );

    if (!textLayer) {
      textLayer = {
        id: crypto.randomUUID(),
        type: 'text',
        assetRef: {
          name: 'TextLayer',
          class: 'text',
          src: '',
          size_kb: 0,
          hash_sha256: '',
          extension: 'txt'
        },
        opacity: 1,
        visible: true,
        zIndex: this.#canvasState.layers.length,
        textElements: []
      };
      this.#canvasState.layers.push(textLayer);
    }

    textLayer.textElements!.push(elem);
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

  getLayers(): VisualLayer[] {
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

  moveTextElement(index: number, x: number, y: number): void {
    const textLayer = this.#canvasState.layers.find(
      (layer): layer is TextVisualLayer => layer.type === 'text'
    );

    if (textLayer) {
      const elem = textLayer.textElements[index];
      if (elem) {
        elem.x = x;
        elem.y = y;
        this.#notify();
      }
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

  removeTextElement(index: number): void {
    const textLayer = this.#canvasState.layers.find(
      (layer): layer is TextVisualLayer => layer.type === 'text'
    );

    if (textLayer) {
      textLayer.textElements.splice(index, 1);
      this.#notify();
    }
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
    this.#canvasState.layers = this.#canvasState.layers.filter(
      layer => layer.type !== 'gif'
    );

    if (anim) {
      const gifLayer: VisualLayer = {
        id: crypto.randomUUID(),
        type: 'gif',
        assetRef: {
          name: 'GifAnimation',
          class: 'gif',
          src: '',
          size_kb: 0,
          hash_sha256: '',
          extension: 'gif'
        },
        opacity: 1,
        visible: true,
        zIndex: this.#canvasState.layers.length,
        gifFrames: anim.frames,
        currentFrame: 0,
        frameElapsed: 0,
        position: { x: 0, y: 0 },
        scale: { x: 1, y: 1 },
        rotation: {
          speed: 0,
          direction: 'n/a',
          currentAngle: 0
        }
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
    this.#canvasState.layers = this.#canvasState.layers.filter(
      layer => layer.type !== 'image'
    );

    if (imageDataUrl) {
      const img = new Image();
      img.src = imageDataUrl;

      const imageLayer: VisualLayer = {
        id: crypto.randomUUID(),
        type: 'image',
        assetRef: {
          name: 'ImageLayer',
          src: imageDataUrl,
          class: 'image',
          size_kb: 0,
          hash_sha256: '',
          extension: 'png'
        },
        opacity: 1,
        visible: true,
        zIndex: 0,
        element: img,
        position: { x: 0, y: 0 },
        scale: { x: 1, y: 1 },
        rotation: {
          speed: 0,
          direction: 'n/a',
          currentAngle: 0
        }
      };

      this.#canvasState.layers.unshift(imageLayer);
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

  updateLayer(index: number, newLayer: VisualLayer): void {
    this.#canvasState.layers[index] = newLayer;
    this.#notify();
  }

  updateTextElement(index: number, newElem: TextElement): void {
    const textLayer = this.#canvasState.layers.find(
      (layer): layer is TextVisualLayer => layer.type === 'text'
    );

    if (textLayer) {
      textLayer.textElements[index] = newElem;
      this.#notify();
    }
  }

  // ================================================= //

  #notify(): void {
    const state = this.get();
    for (const fn of this.#subscribers) fn(state);
  }
}
