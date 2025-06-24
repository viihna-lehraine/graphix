// File: frontend/src/app/config/manifest.browser.ts

import type { AssetManifest } from '@index';

export async function loadAssetManifest(): Promise<AssetManifest> {
  try {
    const res = await fetch('/assets/assets.manifest.json');
    if (!res.ok) throw new Error(`Failed to fetch Asset Manifest`);
    return (await res.json()) as AssetManifest;
  } catch (error) {
    console.error('Error loading Asset Manifest:', error);
    throw new Error('Failed to load Asset Manifest');
  }
}
