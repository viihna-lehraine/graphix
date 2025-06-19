// File: frontend/src/app/build/asset_manifest/partials/getImageDimensions.ts

import fs from 'fs';
import imageSize from 'image-size';

export async function getImageDimensions(filePath: string): Promise<{
  width: number;
  height: number;
}> {
  try {
    const buf = fs.readFileSync(filePath);
    const { width, height } = imageSize(buf);

    return { width, height };
  } catch {
    return { width: 0, height: 0 };
  }
}
