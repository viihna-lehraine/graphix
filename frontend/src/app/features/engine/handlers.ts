// File: frontend/src/app/features/engine/handlers.ts

import type {
  AssetClass,
  AssetType,
  Core,
  EngineHandlers,
  Layer,
  LayerElement
} from '../../types/index.js';

async function setBackgroundFromFile(file: File, core: Core): Promise<void> {
  const { stateManager } = core.services;
  const reader = new FileReader();

  reader.onload = () => {
    const imgUrl = reader.result as string;

    const layers = stateManager.getCanvas().layers;
    const bgIdx = layers.findIndex(l => l.kind === 'background');
    if (bgIdx !== -1) {
      stateManager.removeLayer(bgIdx);
    }

    const img = new window.Image();
    img.src = imgUrl;
    img.onload = () => {
      const backgroundLayer: Layer = {
        id: crypto.randomUUID(),
        name: file.name,
        opacity: 1,
        visible: true,
        zIndex: 0,
        blendMode: 'normal',
        kind: 'background',
        element: img
      };
      stateManager.addLayer(backgroundLayer);
    };
  };
  reader.readAsDataURL(file);
}

async function addImageLayerFromFile(file: File, core: Core): Promise<void> {
  const { stateManager } = core.services;
  const reader = new FileReader();

  reader.onload = () => {
    const imgUrl = reader.result as string;
    const img = new window.Image();
    img.src = imgUrl;

    img.onload = () => {
      const asset = {
        type: 'image' as AssetType,
        name: file.name,
        class: 'static' as AssetClass,
        src: imgUrl,
        ext: file.name.split('.').pop() || 'png',
        tags: [],
        size_kb: file.size / 1024,
        hash_sha256: '',
        credits: false as false,
        license: false as false,
        tileable: false as false,
        width: img.width,
        height: img.height,
        font: false as false,
        animation: false as false
      };

      const imageElement: LayerElement = {
        kind: 'static_image',
        id: crypto.randomUUID(),
        asset,
        position: {
          x: img.width / 2,
          y: img.height / 2
        },
        scale: { x: 1, y: 1 },
        rotation: 0,
        element: img
      };

      const layers = stateManager.getCanvas().layers;
      const imageLayer: Layer = {
        id: crypto.randomUUID(),
        name: file.name,
        opacity: 1,
        visible: true,
        zIndex: layers.length,
        blendMode: 'normal',
        kind: 'image',
        element: imageElement
      };

      stateManager.addLayer(imageLayer);
    };
  };

  reader.readAsDataURL(file);
}

// ============================================================= //

export const handlers: EngineHandlers = {
  setBackgroundFromFile,
  addImageLayerFromFile
} as const;
