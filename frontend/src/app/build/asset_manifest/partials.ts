// File: frontend/src/app/build/asset_manifest/partials.ts

import type {
  AnimatedAssetProps,
  Asset,
  AssetsExtra,
  AssetType,
  BackgroundExtra,
  BlendMode,
  BorderExtra,
  Data,
  FontExtra,
  GifExtra,
  ImageExtra,
  OverlayExtra,
  StickerExtra
} from '@meta/index.js';
import fs from 'fs';
import fsPromises from 'fs/promises';
import crypto from 'crypto';
import { parseGIF, decompressFrames } from 'gifuct-js';
import imageSize from 'image-size';
import path from 'path';

export async function getAssetClassAndFields(
  relPath: string,
  ext: string,
  filePath: string,
  data: Data
): Promise<{ assetType: AssetType; extra: AssetsExtra }> {
  const rel = relPath.replace(/\\/g, '/').toLowerCase();

  // OVERLAY
  if (rel.includes('/overlays/')) {
    let blendMode = data.defaults.blendMode;
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
  const { width, height } = await getImageDimensions(filePath);
  const extra: ImageExtra = {
    width,
    height,
    animation: false,
    tileable: false
  };
  return { assetType: 'image', extra };
}

export async function getFileInfo(filePath: string): Promise<{
  size_kb: number;
  hash_sha256: string;
}> {
  const stat = fs.statSync(filePath);
  const size_kb = Math.round(stat.size / 1024);
  const buf = fs.readFileSync(filePath);
  const hash = crypto.createHash('sha256').update(buf).digest('hex');
  return { size_kb, hash_sha256: hash };
}

export async function getGifInfo(filePath: string): Promise<{
  width: number;
  height: number;
  frameCount: number;
}> {
  const buf = fs.readFileSync(filePath);
  const gif = parseGIF(buf);
  const frames = decompressFrames(gif, true);

  return {
    width: gif.lsd.width,
    height: gif.lsd.height,
    frameCount: frames.length
  };
}

export async function getImageDimensions(filePath: string): Promise<{
  width: number;
  height: number;
}> {
  try {
    const buf = fs.readFileSync(filePath);
    const { width, height } = imageSize(buf);

    return { width, height };
  } catch {
    return { width: 0, height: 0 };
  }
}

export async function readAssetMetadata(
  assetFilePath: string
): Promise<Record<string, unknown>> {
  const metaFilePath = assetFilePath + '.json';

  if (fs.existsSync(metaFilePath)) {
    try {
      const data = fs.readFileSync(metaFilePath, 'utf-8');

      return JSON.parse(data);
    } catch (err) {
      console.warn(`Failed to parse ${metaFilePath}:`, err);
    }
  }

  return {};
}

export async function scanDir(
  dir: string,
  base: string = '',
  data: Data
): Promise<Asset[]> {
  const files: Asset[] = [];
  const entries = await fsPromises.readdir(dir);

  for (const entry of entries) {
    const full = path.join(dir, entry);
    const rel = path.join(base, entry);

    const stat = await fsPromises.stat(full);

    if (stat.isDirectory()) {
      const nestedFiles = await scanDir(full, rel, data);
      files.push(...nestedFiles);
    } else {
      if (entry.endsWith('.json')) continue;

      const ext = path.extname(entry).slice(1).toLowerCase();

      const { size_kb, hash_sha256 } = await getFileInfo(full);
      const { assetType, extra } = await getAssetClassAndFields(
        rel,
        ext,
        full,
        data
      );
      const assetMetadata = await readAssetMetadata(full);

      // ---------------------------
      // narrowing logic
      // ---------------------------

      let tileable: boolean = false;
      let width: number | false = false;
      let height: number | false = false;
      let blendMode: BlendMode = data.defaults.blendMode;
      let animation: AnimatedAssetProps | false = false;
      let font: Asset['font'] = false;

      switch (assetType) {
        case 'background':
        case 'border':
        case 'image':
          tileable =
            (extra as BackgroundExtra | BorderExtra | ImageExtra).tileable ??
            false;
          width =
            (extra as BackgroundExtra | BorderExtra | ImageExtra).width ??
            (false as false);
          height = (extra as BackgroundExtra | BorderExtra | ImageExtra).height;
          animation = (extra as BackgroundExtra | BorderExtra | ImageExtra)
            .animation;
          break;

        case 'gif':
          animation = (extra as GifExtra).animation;
          break;

        case 'font':
          font = (extra as FontExtra).font;
          break;

        case 'overlay':
          blendMode = (extra as OverlayExtra).blendMode;
          break;

        case 'sticker':
          width = (extra as StickerExtra).width;
          height = (extra as StickerExtra).height;
          animation = (extra as StickerExtra).animation;
          break;
      }

      // ---------------------------
      // build asset object
      // ---------------------------

      const asset: Asset = {
        type: assetType,
        name: path.basename(entry, '.' + ext),
        class: assetType === 'gif' ? 'animated' : 'static',
        src: '/assets/user/' + rel.replace(/\\/g, '/'),
        ext,
        tags: [],
        size_kb,
        hash_sha256,
        credits: '',
        license: '',
        tileable,
        width,
        height,
        blendMode,
        animation,
        font,
        ...assetMetadata // STRICT: overrides everything above
      };

      files.push(asset);
    }
  }

  files.forEach((asset, i) => {
    asset.index = i + 1;
  });
  return files;
}
