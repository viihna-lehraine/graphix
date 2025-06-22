// File: frontend/src/app/engine/LayerService.ts

import type {
  Asset,
  Layer,
  LayerElement,
  LayerServiceContract,
  Utilities
} from '../meta/index.js';

export class LayerService implements LayerServiceContract {
  static #instance: LayerService | null = null;

  #utils: Utilities;

  constructor(utils: Utilities) {
    this.#utils = utils;
  }

  static getInstance(utils: Utilities): LayerService {
    if (!this.#instance) {
      this.#instance = new LayerService(utils);
    }
    return this.#instance;
  }

  async createImageLayer(src: string, file: File): Promise<Layer> {
    const hash_sha256 = await this.#utils.getFileSHA256(file);
    const name = this.#utils.getFileName(file);
    const ext = this.#utils.getFileExtension(file);
    const size_kb = this.#utils.getFileSizeInKB(file);
    const { width, height } = await this.#utils.getImageDimensions(file);

    const asset: Asset = {
      type: 'image',
      name,
      class: 'static',
      src,
      ext,
      tags: ['user-upload'],
      size_kb,
      hash_sha256,
      credits: false,
      license: false,
      tileable: false,
      width,
      height,
      font: false,
      animation: false,
      blendMode: 'normal'
    };

    const img = new window.Image();
    img.src = src;

    const element: LayerElement = {
      kind: 'static_image',
      id: crypto.randomUUID(),
      asset,
      position: { x: 0, y: 0 },
      scale: { x: 1, y: 1 },
      rotation: 0,
      element: img
    };

    return {
      id: crypto.randomUUID(),
      name: asset.name,
      opacity: 1,
      visible: true,
      zIndex: 0,
      blendMode: 'normal',
      kind: 'image',
      element
    };
  }

  getElementById(layers: Layer[], elementId: string): LayerElement | undefined {
    for (const layer of layers) {
      const el = layer.element as LayerElement;
      if ('kind' in el && el.id === elementId) {
        return el;
      }
    }
    return undefined;
  }

  getLayerById(layers: Layer[], layerId: string): Layer | undefined {
    return layers.find(l => l.id === layerId);
  }
}
