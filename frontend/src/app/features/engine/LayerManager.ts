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

  addElementToLayer(layerId: string, element: LayerElement): void {
    const layer = this.#layers.find(l => l.id === layerId);
    if (layer) {
      layer.elements.push(element);
      this.#notify();
    }
  }

  addLayer(layer: Layer): void {
    this.#layers.push(layer);
    this.#notify();
  }

  getElementById(layerId: string, elementId: string): LayerElement | undefined {
    const layer = this.#layers.find(l => l.id === layerId);
    if (layer) {
      return layer.elements.find(e => e.id === elementId);
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

  removeElementFromLayer(layerId: string, elementId: string): void {
    const layer = this.#layers.find(l => l.id === layerId);
    if (layer) {
      const elementIndex = layer.elements.findIndex(e => e.id === elementId);
      if (elementIndex !== -1) {
        layer.elements.splice(elementIndex, 1);
        this.#notify();
      } else {
        throw new Error(
          `Element with id ${elementId} not found in layer ${layerId}`
        );
      }
    } else {
      throw new Error(`Layer with id ${layerId} not found`);
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
    if (layer) {
      const elementIndex = layer.elements.findIndex(e => e.id === elementId);
      if (elementIndex !== -1) {
        layer.elements[elementIndex] = updatedElement;
      } else {
        throw new Error(
          `Element with id ${elementId} not found in layer ${layerId}`
        );
      }
    } else {
      throw new Error(`Layer with id ${layerId} not found`);
    }
    this.#notify();
  }

  // *********************************************************** //

  createEmptyLayer(name: string, zIndex: number): Layer {
    return {
      id: crypto.randomUUID(),
      name,
      opacity: 1,
      visible: true,
      zIndex,
      blendMode: 'normal',
      elements: []
    };
  }

  #notify(): void {
    for (const fn of this.#subscribers) fn();
  }
}

// ************************************************************* //
// ************************************************************* //

export function createLayer(name: string, zIndex: number): Layer {
  return {
    id: crypto.randomUUID(),
    name,
    opacity: 1,
    visible: true,
    zIndex,
    blendMode: 'normal',
    elements: []
  };
}
