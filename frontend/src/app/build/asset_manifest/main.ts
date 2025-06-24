// File: frontend/src/app/build/asset_manifest/main.ts

import fs from 'fs';
import path from 'path';

const projectRoot = path.resolve(
  new URL('../../../../', import.meta.url).pathname
);
const assetRoot = path.resolve(projectRoot, 'public/assets');
const assetDir = path.resolve(assetRoot, 'user/');
const outFile = path.resolve(assetRoot, 'assets.manifest.json');
const outDir = path.dirname(outFile);

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
if (!fs.existsSync(assetDir)) {
  console.warn(
    `Asset directory ${assetDir} not found. Writing empty manifest.`
  );
  fs.writeFileSync(outFile, '[]', 'utf-8');
  process.exit(0);
}
if (fs.existsSync(outFile)) {
  fs.unlinkSync(outFile);
  console.log(`Removed existing manifest at ${outFile}`);
}

const { scanDir } = await import('./partials.js');
const manifest = await scanDir(assetDir, '');
const manifestWithIndex = manifest.map((asset, i) => ({
  ...asset,
  index: i + 1
}));

fs.writeFileSync(
  outFile,
  JSON.stringify({ assets: manifestWithIndex }, null, 2),
  'utf-8'
);

if (manifest.length === 0) {
  console.warn(
    `No files found in the assets directory, "${assetDir}". The Assets Manifest is empty.`
  );
} else {
  console.log(
    `Assets Manifest generated at ${outFile} (${manifest.length} assets)`
  );
}
