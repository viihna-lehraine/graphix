// File: frontend/src/app/build/gen_asset_manifest.ts

import type {
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
} from '../types/index.ts';
import fs from 'fs';
import crypto from 'crypto';
import { decompressFrames, parseGIF } from 'gifuct-js';
import imageSize from 'image-size';
import path from 'path';
import { AnimatedAssetProps } from '../types/index.js';
import { data } from '../data/index.js';

const projectRoot = path.resolve(
  new URL('../../../', import.meta.url).pathname
);
const assetRoot = path.resolve(projectRoot, 'public/assets');
const assetDir = path.resolve(assetRoot, 'user/');
const outFile = path.resolve(assetRoot, 'assets.manifest.json');
const outDir = path.dirname(outFile);

// =================================================== //

function getAssetClassAndFields(
  relPath: string,
  ext: string,
  filePath: string,
  data: Data
): { assetType: AssetType; extra: AssetsExtra } {
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
    const { frameCount } = getGifInfo(filePath);
    const extra: GifExtra = {
      animation: {
        frames: {
          count: frameCount,
          rate: 15 // TODO: extract real frame rate if possible
        },
        rotation: false
      }
    };
    return { assetType: 'gif', extra };
  }

  // BORDER
  if (rel.includes('/borders/')) {
    const { width, height } = getImageDimensions(filePath) ?? {
      width: false as false,
      height: false as false
    };
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
    const { width, height } = getImageDimensions(filePath) ?? {
      width: 0,
      height: 0
    };
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
    const { width, height } = getImageDimensions(filePath) ?? {
      width: false as false,
      height: false as false
    };
    const extra: BackgroundExtra = {
      width,
      height,
      animation: false,
      tileable: false
    };
    return { assetType: 'background', extra };
  }

  // DEFAULT: IMAGE
  const { width, height } = getImageDimensions(filePath) ?? {
    width: false as false,
    height: false as false
  };
  const extra: ImageExtra = {
    width,
    height,
    animation: false,
    tileable: false
  };
  return { assetType: 'image', extra };
}

//================================================== //

function getFileInfo(filePath: string): {
  size_kb: number;
  hash_sha256: string;
} {
  const stat = fs.statSync(filePath);
  const size_kb = Math.round(stat.size / 1024);
  const buf = fs.readFileSync(filePath);
  const hash = crypto.createHash('sha256').update(buf).digest('hex');
  return { size_kb, hash_sha256: hash };
}

// =================================================== //

function getGifInfo(filePath: string): {
  width: number;
  height: number;
  frameCount: number;
} {
  const buf = fs.readFileSync(filePath);
  const gif = parseGIF(buf);
  const frames = decompressFrames(gif, true);

  return {
    width: gif.lsd.width,
    height: gif.lsd.height,
    frameCount: frames.length
  };
}

// =================================================== //

function getImageDimensions(
  filePath: string
): { width: number; height: number } | null {
  const buf = fs.readFileSync(filePath);
  const { width, height } = imageSize(buf);
  return { width, height };
}

// =================================================== //

function readAssetMetadata(assetFilePath: string): Record<string, unknown> {
  const metaFilePath = assetFilePath + '.json';
  if (fs.existsSync(metaFilePath)) {
    try {
      const data = fs.readFileSync(metaFilePath, 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      console.warn(`[Manifest] Failed to parse ${metaFilePath}:`, err);
    }
  }
  return {};
}

// =================================================== //

function scanDir(dir: string, base: string = '', data: Data): Asset[] {
  const files: Asset[] = [];

  fs.readdirSync(dir).forEach(entry => {
    const full = path.join(dir, entry);
    const rel = path.join(base, entry);

    if (fs.statSync(full).isDirectory()) {
      files.push(...scanDir(full, rel, data));
    } else {
      // skip metadata files
      if (entry.endsWith('.json')) return;

      const ext = path.extname(entry).slice(1).toLowerCase();
      const { size_kb, hash_sha256 } = getFileInfo(full);
      const { assetType, extra } = getAssetClassAndFields(rel, ext, full, data);
      const assetMetadata = readAssetMetadata(full);

      // ---------------------------
      // narrowing logic
      // ---------------------------

      let tileable: boolean = false;
      let width: number | false = false;
      let height: number | false = false;
      let blendMode: BlendMode = data.config.defaults.blendMode;
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
  });

  return files;
}

// =================================================== //

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
if (!fs.existsSync(assetDir)) {
  console.warn(
    `generateAssetManifest.mjs - Asset directory ${assetDir} does not exist! Writing an empty manifest.`
  );
  fs.writeFileSync(outFile, '[]', 'utf-8');
  process.exit(0);
}

if (fs.existsSync(outFile)) {
  fs.unlinkSync(outFile);
  console.log(`Removed existing manifest file at ${outFile}`);
}

const manifest = scanDir(assetDir, '', data);

fs.writeFileSync(outFile, JSON.stringify(manifest, null, 2), 'utf-8');
if (manifest.length === 0) {
  console.warn(
    `[AssetManifest] No files found in "${assetDir}". Manifest is empty.`
  );
} else {
  console.log(
    `Asset manifest generated at ${outFile} (${manifest.length} assets)`
  );
}
