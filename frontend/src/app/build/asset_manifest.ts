// File: frontend/src/app/build/asset_manifest.ts

import type {
  Asset,
  AssetsExtra,
  BackgroundExtra,
  BorderExtra,
  FontExtra,
  GifExtra,
  ImageExtra,
  OverlayExtra,
  StickerExtra
} from '../types/index.js';
import fs from 'fs';
import crypto from 'crypto';
import { decompressFrames, parseGIF } from 'gifuct-js';
import imageSize from 'image-size';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const assetDir = path.resolve(__dirname, '../public/assets/user/');
const outFile = path.resolve(
  __dirname,
  '../public/assets/assets.manifest.json'
);

const outDir = path.dirname(outFile);

// =================================================== //

function getAssetClassAndFields(
  relPath: string,
  ext: string,
  filePath: string
): { assetType: Asset['type']; extra: AssetsExtra } {
  const rel = relPath.replace(/\\/g, '/').toLowerCase();

  // OVERLAY
  if (rel.includes('/overlays/')) {
    let blendMode: Asset['blendMode'] = undefined;
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
        }
      }
    };
    return { assetType: 'gif', extra };
  }

  // BORDER
  if (rel.includes('/borders/')) {
    const { width, height } = getImageDimensions(filePath) ?? {
      width: undefined,
      height: undefined
    };
    const extra: BorderExtra = { width, height };
    return { assetType: 'border', extra };
  }

  // STICKER
  if (rel.includes('/stickers/')) {
    const { width, height } = getImageDimensions(filePath) ?? {
      width: 0,
      height: 0
    };
    const extra: StickerExtra = { width, height };
    return { assetType: 'sticker', extra };
  }

  // FONT
  if (rel.includes('/fonts/')) {
    const extra: FontExtra = {
      font: false
    };
    return { assetType: 'font', extra };
  }

  // BACKGROUND
  if (rel.includes('/backgrounds/')) {
    const { width, height } = getImageDimensions(filePath) ?? {
      width: undefined,
      height: undefined
    };
    const extra: BackgroundExtra = { width, height };
    return { assetType: 'background', extra };
  }

  // DEFAULT: IMAGE
  const { width, height } = getImageDimensions(filePath) ?? {
    width: undefined,
    height: undefined
  };
  const extra: ImageExtra = { width, height };
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

function scanDir(dir: string, base: string = ''): Asset[] {
  const files: Asset[] = [];

  fs.readdirSync(dir).forEach(entry => {
    const full = path.join(dir, entry);
    const rel = path.join(base, entry);

    if (fs.statSync(full).isDirectory()) {
      files.push(...scanDir(full, rel));
    } else {
      // skip metadata files
      if (entry.endsWith('.json')) return;

      const ext = path.extname(entry).slice(1).toLowerCase();
      const { size_kb, hash_sha256 } = getFileInfo(full);
      const { assetType, extra } = getAssetClassAndFields(rel, ext, full);
      const assetMetadata = readAssetMetadata(full);

      // determine type, class, etc
      const asset = {
        type: assetType,
        name: path.basename(entry, '.' + ext),
        class:
          assetType === ('gif' as Asset['class'])
            ? ('animation' as Asset['class'])
            : ['background', 'overlay', 'border', 'sticker', 'image'].includes(
                  assetType
                )
              ? ('image' as Asset['class'])
              : assetType === 'font'
                ? 'text'
                : 'image',
        src: '/assets/user/' + rel.replace(/\\/g, '/'),
        ext,
        tags: [],
        size_kb,
        hash_sha256,
        credits: '',
        license: '',
        tileable: extra.tileable ?? false,
        width: extra.width ?? undefined,
        height: extra.height ?? undefined,
        blendMode: extra.blendMode ?? undefined,
        animation: extra.animation ?? undefined,
        font: extra.font ?? undefined,
        ...assetMetadata // strict: overrides everything above
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

const manifest = scanDir(assetDir);

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
