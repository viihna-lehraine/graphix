// File: frontend/scripts/generateAssetManifest.mjs

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const assetDir = path.resolve(__dirname, '../public/assets/user/');
const outFile = path.resolve(__dirname, '../public/assets/userManifest.json');

const outDir = path.dirname(outFile);

// =================================================== //

function getAssetClassAndFields(relPath, ext) {
  let assetClass = 'image';
  let extra = {};

  const rel = relPath.replace(/\\/g, '/').toLowerCase();

  if (rel.includes('/overlays/')) {
    assetClass = 'overlay';
    // use filenames as blendMode hints, e.g. 'overlay_1_multiply.png'
    if (rel.includes('multiply')) {
      extra.blendMode = 'multiply';
    } else if (rel.includes('screen')) {
      extra.blendMode = 'screen';
    } else if (rel.includes('overlay')) {
      extra.blendMode = 'overlay';
    } else if (rel.includes('darken')) {
      extra.blendMode = 'darken';
    } else if (rel.includes('lighten')) {
      extra.blendMode = 'lighten';
    }
  } else if (ext === 'gif' || rel.includes('/gif/')) {
    assetClass = 'gif';
    extra.animation = { frames: { count: 60, rate: 15 } }; // TODO: replace with real GIF metadata
  } else if (rel.includes('/borders/')) {
    assetClass = 'border';
  } else if (rel.includes('/stickers/')) {
    assetClass = 'sticker';
  }

  return { assetClass, extra };
}

//================================================== //

function getFileInfo(filePath) {
  const stat = fs.statSync(filePath);
  const size_kb = Math.round(stat.size / 1024);
  const buf = fs.readFileSync(filePath);
  const hash = crypto.createHash('sha256').update(buf).digest('hex');

  return { size_kb, hash_sha256: hash };
}

// =================================================== //

function scanDir(dir, base = '') {
  const files = [];

  fs.readdirSync(dir).forEach(entry => {
    const full = path.join(dir, entry);
    const rel = path.join(base, entry);

    if (fs.statSync(full).isDirectory()) {
      files.push(...scanDir(full, rel));
    } else {
      const ext = path.extname(entry).slice(1).toLowerCase();
      const { size_kb, hash_sha256 } = getFileInfo(full);
      const { assetClass, extra } = getAssetClassAndFields(rel, ext);

      files.push({
        name: path.basename(entry, '.' + ext),
        src: '/assets/user/' + rel.replace(/\\/g, '/'),
        size_kb,
        hash_sha256,
        class: assetClass,
        extension: path.extname(entry).slice(1),
        ...extra
      });
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
