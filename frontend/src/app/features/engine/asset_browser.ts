// File: frontend/src/app/features/asset_browser.ts

import type {
  Core,
  GifAsset,
  ImageAsset,
  OverlayAsset,
  StickerAsset
} from '../../types/index.js';

function fileExtensionToVisualLayerType(
  core: Core,
  ext: string
): 'image' | 'gif' | 'overlay' | 'sticker' | 'text' | 'video' {
  switch (ext.toLowerCase()) {
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'webp':
      return 'image';

    case 'gif':
      return 'gif';

    case 'mp4':
    case 'webm':
      return 'video';
    default:
      core.services.log.warn(`Unsupported file extension: ${ext}`);
      return 'image';
  }
}

async function renderAssetBrowser(core: Core): Promise<void> {
  const {
    data: {
      dom: { classes, ids }
    },
    services: { log, stateManager }
  } = core;
  const browser = document.getElementById(ids.assetBrowserDiv);
  if (!browser) return;

  browser.innerHTML = '';

  const { loadAssetManifest } = await import('../../core/config/manifest.js');
  const { createLayer } = await import('./layers.js');

  const asset_manifest = await loadAssetManifest();

  asset_manifest.forEach(asset => {
    const thumb = document.createElement('img');
    thumb.src = asset.src;
    thumb.alt = asset.name;
    thumb.className = classes.assetBrowserThumb;

    thumb.addEventListener('click', () => {
      const fullAsset = {
        ...asset,
        size_kb: (asset as any).size_kb ?? 0,
        hash_sha256: (asset as any).hash_sha256 ?? '',
        extension: asset.extension ?? ''
      };

      let newLayer;

      switch (asset.class) {
        case 'animation':
          newLayer = createLayer.gif(
            fullAsset as GifAsset,
            stateManager.getCanvas().layers.length
          );
          break;

        case 'image':
          newLayer = createLayer.image(
            fullAsset as ImageAsset,
            stateManager.getCanvas().layers.length
          );
          break;

        case 'overlay':
          newLayer = createLayer.overlay(
            fullAsset as OverlayAsset,
            stateManager.getCanvas().layers.length
          );
          break;

        case 'sticker':
          newLayer = createLayer.sticker(
            fullAsset as StickerAsset,
            stateManager.getCanvas().layers.length
          );
          break;

        default:
          log.warn(`Unsupported asset class: ${asset.class}`);
          newLayer = createLayer.image(
            fullAsset as ImageAsset,
            stateManager.getCanvas().layers.length
          );
      }

      stateManager.addLayer(newLayer);
    });
  });
}

export { fileExtensionToVisualLayerType, renderAssetBrowser };
