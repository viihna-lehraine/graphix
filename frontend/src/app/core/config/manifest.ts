// File: frontend/src/app/core/config/manifest.ts

import type { AssetManifest } from '../../types/index.js';

export async function loadAssetManifest(): Promise<AssetManifest> {
  const res = await fetch('/assets/assets.manifest.json');
  const json = await res.json();

  if (!res.ok)
    throw new Error(`Failed to load asset manifest: ${res.statusText}`);
  return json as AssetManifest;
}
