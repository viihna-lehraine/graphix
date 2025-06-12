// File: frontend/src/app/features/asset_browser.ts

import type { Core, Layer, LayerElement } from '../../types/index.js';

function fileExtensionToVisualLayerType(
  core: Core,
  ext: string
): 'static_image' | 'animated_image' {
  switch (ext.toLowerCase()) {
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'webp':
      return 'static_image';

    case 'gif':
      return 'animated_image';
    default:
      core.services.log.warn(`Unsupported file extension: ${ext}`);
      return 'static_image';
  }
}

async function renderAssetBrowser(core: Core): Promise<void> {
  const {
    data: {
      dom: { classes, ids }
    },
    services: { stateManager }
  } = core;
  const browser = document.getElementById(ids.assetBrowserDiv);
  if (!browser) return;

  browser.innerHTML = '';

  const { loadAssetManifest } = await import('../../core/config/manifest.js');
  const asset_manifest = await loadAssetManifest();

  asset_manifest.forEach(asset => {
    const thumb = document.createElement('img');
    thumb.src = asset.src;
    thumb.alt = asset.name;
    thumb.className = classes.assetBrowserThumb;

    thumb.addEventListener('click', () => {
      // determine layer element type from asset
      const elemKind = fileExtensionToVisualLayerType(core, asset.ext);

      let element: LayerElement;
      if (elemKind === 'animated_image') {
        element = {
          kind: 'animated_image',
          id: crypto.randomUUID(),
          asset,
          position: { x: 0, y: 0 },
          scale: { x: 1, y: 1 },
          rotation: false,
          gifFrames: [],
          currentFrame: 0,
          frameElapsed: 0,
          element: null
        };
      } else {
        element = {
          kind: 'static_image',
          id: crypto.randomUUID(),
          asset,
          position: { x: 0, y: 0 },
          scale: { x: 1, y: 1 },
          rotation: 0,
          element: null
        };
      }

      // build a Layer to hold this element
      const newLayer: Layer = {
        id: crypto.randomUUID(),
        name: asset.name,
        opacity: 1,
        visible: true,
        zIndex: stateManager.getCanvas().layers.length,
        blendMode: asset.blendMode ?? 'normal',
        elements: [element]
      };

      stateManager.addLayer(newLayer);
    });

    browser.appendChild(thumb);
  });
}

export { fileExtensionToVisualLayerType, renderAssetBrowser };
