// File: frontend/src/app/core/config/manifest.ts

import type { AssetManifestEntry } from '../../types/index.js';

export async function loadAssetManifest(): Promise<AssetManifestEntry[]> {
  const resp = await fetch('/assets/userManifest.json');
  if (!resp.ok)
    throw new Error(`Failed to load asset manifest: ${resp.statusText}`);
  return resp.json();
}
