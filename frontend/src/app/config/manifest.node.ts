// File: frontend/src/app/config/manifest.node.ts

import type { AssetManifest } from '@index';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function loadAssetManifest(): Promise<AssetManifest> {
  const manifestPath = join(
    process.cwd(),
    'public',
    'assets',
    'assets.manifest.json'
  );
  const fileContents = readFileSync(manifestPath, 'utf-8');

  return JSON.parse(fileContents) as AssetManifest;
}
