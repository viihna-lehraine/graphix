// File: frontend/src/app/config/manifest.ts

import type { AssetManifest } from '../meta/index.js';

export async function loadAssetManifest(): Promise<AssetManifest> {
  const res = await fetch('/assets/assets.manifest.json');
  const json = await res.json();

  if (!res.ok)
    throw new Error(`Failed to load asset manifest: ${res.statusText}`);
  return json as AssetManifest;
}
