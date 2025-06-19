// File: frontend/src/app/build/asset_manifest/partials/getAssetClassAndFields.ts

import type {
  AssetsExtra,
  AssetType,
  BackgroundExtra,
  BorderExtra,
  Data,
  FontExtra,
  GifExtra,
  ImageExtra,
  OverlayExtra,
  StickerExtra
} from '../../../types/index.js';

export async function getAssetClassAndFields(
  relPath: string,
  ext: string,
  filePath: string,
  data: Data
): Promise<{ assetType: AssetType; extra: AssetsExtra }> {
  const rel = relPath.replace(/\\/g, '/').toLowerCase();

  // OVERLAY
  if (rel.includes('/overlays/')) {
    let blendMode = data.config.defaults.blendMode;
    if (rel.includes('multiply')) blendMode = 'multiply';
    else if (rel.includes('screen')) blendMode = 'screen';
    else if (rel.includes('overlay')) blendMode = 'overlay';
    else if (rel.includes('darken')) blendMode = 'darken';
    else if (rel.includes('lighten')) blendMode = 'lighten';
    const extra: OverlayExtra = { blendMode };

    return { assetType: 'overlay', extra };
  }

  // GIF
  if (ext === 'gif' || rel.includes('/gif/')) {
    const { getGifInfo } = await import('./getGifInfo.js');

    const { frameCount } = await getGifInfo(filePath);
    const extra: GifExtra = {
      animation: {
        frames: {
          count: frameCount,
          rate: 15 // TODO: extract real frame rate
        },
        rotation: false
      }
    };
    return { assetType: 'gif', extra };
  }

  // BORDER
  if (rel.includes('/borders/')) {
    const { getImageDimensions } = await import('./getImageDimensions.js');
    const { width, height } = await getImageDimensions(filePath);

    const extra: BorderExtra = {
      width,
      height,
      animation: false,
      tileable: false
    };
    return { assetType: 'border', extra };
  }

  // STICKER
  if (rel.includes('/stickers/')) {
    const { getImageDimensions } = await import('./getImageDimensions.js');
    const { width, height } = await getImageDimensions(filePath);
    const extra: StickerExtra = { width, height, animation: false };
    return { assetType: 'sticker', extra };
  }

  // FONT
  if (rel.includes('/fonts/')) {
    const extra: FontExtra = { font: {} };
    return { assetType: 'font', extra };
  }

  // BACKGROUND
  if (rel.includes('/backgrounds/')) {
    const { getImageDimensions } = await import('./getImageDimensions.js');

    const { width, height } = await getImageDimensions(filePath);
    const extra: BackgroundExtra = {
      width,
      height,
      animation: false,
      tileable: false
    };
    return { assetType: 'background', extra };
  }

  // DEFAULT: IMAGE
  const { getImageDimensions } = await import('./getImageDimensions.js');
  const { width, height } = await getImageDimensions(filePath);
  const extra: ImageExtra = {
    width,
    height,
    animation: false,
    tileable: false
  };
  return { assetType: 'image', extra };
}
