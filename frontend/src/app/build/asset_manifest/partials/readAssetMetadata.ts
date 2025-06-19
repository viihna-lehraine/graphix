// File: frontend/src/app/build/asset_manifest/partials/readAssetMetadata.ts

import fs from 'fs';

export async function readAssetMetadata(
  assetFilePath: string
): Promise<Record<string, unknown>> {
  const metaFilePath = assetFilePath + '.json';

  if (fs.existsSync(metaFilePath)) {
    try {
      const data = fs.readFileSync(metaFilePath, 'utf-8');

      return JSON.parse(data);
    } catch (err) {
      console.warn(`Failed to parse ${metaFilePath}:`, err);
    }
  }

  return {};
}
