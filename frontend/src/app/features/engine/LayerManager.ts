// File: frontend/src/app/features/engine/LayerManager.ts

import type {
  Layer,
  LayerElement,
  LayerManagerContract
} from '../../types/index.js';

// *********************************************************** //
// *********************************************************** //

export class LayerManager implements LayerManagerContract {
  static #instance: LayerManager | null = null;

  #layers: Layer[] = [];
  #subscribers: Set<() => void> = new Set();

  // *********************************************************** //

  constructor(layers: Layer[]) {
    this.#layers = layers;
  }

  static getInstance(layers: Layer[] = []): LayerManager {
    if (!this.#instance) {
      this.#instance = new LayerManager(layers);
    }
    return this.#instance;
  }

  // *********************************************************** //

  addLayer(layer: Layer): void {
    this.#layers.push(layer);
    this.#notify();
  }

  getElementById(elementId: string): LayerElement | undefined {
    for (const layer of this.#layers) {
      const el = layer.element as LayerElement;
      if ('kind' in el && el.id === elementId) {
        return el;
      }
    }
    return undefined;
  }

  getLayerById(layerId: string): Layer | undefined {
    return this.#layers.find(l => l.id === layerId);
  }

  getLayers(): Layer[] {
    return this.#layers;
  }

  moveLayers(fromIndex: number, toIndex: number): void {
    if (
      fromIndex < 0 ||
      fromIndex >= this.#layers.length ||
      toIndex < 0 ||
      toIndex >= this.#layers.length
    ) {
      throw new Error('Invalid layer index');
    }
    const [movedLayer] = this.#layers.splice(fromIndex, 1);
    this.#layers.splice(toIndex, 0, movedLayer);
    this.#notify();
  }

  removeElementById(elementId: string): void {
    const idx = this.#layers.findIndex(l => l.element.id === elementId);
    if (idx !== -1) {
      this.#layers.splice(idx, 1);
      this.#notify();
    }
  }

  removeLayer(layerId: string): void {
    const layerIndex = this.#layers.findIndex(l => l.id === layerId);
    if (layerIndex !== -1) {
      this.#layers.splice(layerIndex, 1);
      this.#notify();
    } else {
      throw new Error(`Layer with id ${layerId} not found`);
    }
  }

  subscribe(fn: () => void): () => void {
    this.#subscribers.add(fn);
    return () => {
      this.#subscribers.delete(fn);
    };
  }

  updateElement(
    layerId: string,
    elementId: string,
    updatedElement: LayerElement
  ): void {
    const layer = this.#layers.find(l => l.id === layerId);
    if (!layer) throw new Error(`Layer with id ${layerId} not found`);
    if (layer.element.id === elementId) {
      layer.element = updatedElement;
      this.#notify();
    } else {
      throw new Error(
        `Element with id ${elementId} not found in layer ${layerId}`
      );
    }
  }

  // *********************************************************** //

  #notify(): void {
    for (const fn of this.#subscribers) fn();
  }
}

// ************************************************************* //
// ************************************************************* //

export function createLayer(
  name: string,
  zIndex: number,
  element: LayerElement
): Layer {
  return {
    id: crypto.randomUUID(),
    name,
    opacity: 1,
    visible: true,
    zIndex,
    blendMode: 'normal',
    kind: 'image',
    element
  };
}
