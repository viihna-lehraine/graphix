// File: frontend/src/app/build/hash_table/main.ts

import type { AssetManifest } from '@index';
import fs from 'fs';
import path from 'path';

const projectRoot = path.resolve(
  new URL('../../../../', import.meta.url).pathname
);
const assetRoot = path.resolve(projectRoot, 'public/assets');
const manifestFile = path.resolve(assetRoot, 'assets.manifest.json');

const manifest: AssetManifest = JSON.parse(
  fs.readFileSync(manifestFile, 'utf-8')
);
const hashTable: Record<string, { index: number | undefined }> = {};

manifest.assets.forEach(asset => {
  if (asset.hash_sha256) {
    hashTable[asset.hash_sha256] = {
      index: asset.index
    };
  }
});

const hashTableFile = path.resolve(assetRoot, 'assets.hash-table.json');

if (fs.existsSync(hashTableFile)) {
  fs.unlinkSync(hashTableFile);
  console.log(`Removed existing hash table file: ${hashTableFile}`);
} else {
  fs.writeFileSync(hashTableFile, JSON.stringify(hashTable, null, 2), 'utf-8');
  console.log(
    `Wrote hash table with ${Object.keys(hashTable).length} entries to ${hashTableFile}`
  );
}
