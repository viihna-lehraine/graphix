// File: frontend/src/app/engine/asset_browser.ts

import type { AssetBrowserFunctions, Core, Layer, LayerElement } from '@index';

function fileExtensionToVisualLayerType(
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
      console.warn(`Unsupported file extension: ${ext}`);
      return 'static_image';
  }
}

async function renderAssetBrowser(core: Core): Promise<void> {
  const browser = document.getElementById(core.data.ids.assetBrowserDiv);
  if (!browser) return;

  browser.innerHTML = '';

  const { loadAssetManifest } = await import('@config/manifest.browser.js');
  const asset_manifest = await loadAssetManifest();

  (asset_manifest.assets || []).forEach(asset => {
    const thumb = document.createElement('img');
    thumb.src = asset.src;
    thumb.alt = asset.name;
    thumb.className = core.data.classes.assetBrowserThumb;

    thumb.addEventListener('click', () => {
      const elemKind = fileExtensionToVisualLayerType(asset.ext);

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

      const newLayer: Layer = {
        id: crypto.randomUUID(),
        name: asset.name,
        opacity: 1,
        visible: true,
        zIndex: core.services.stateManager.getCanvas().layers.length,
        blendMode: asset.blendMode ?? 'normal',
        kind: 'image',
        element
      };

      core.services.stateManager.addLayer(newLayer);
    });

    browser.appendChild(thumb);
  });
}

export const assetBrowserFns: AssetBrowserFunctions = {
  fileExtensionToVisualLayerType,
  render: renderAssetBrowser
} as const;
