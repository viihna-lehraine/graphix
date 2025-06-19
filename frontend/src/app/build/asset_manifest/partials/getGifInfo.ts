// File: frontend/src/app/build/asset_manifest/partials/getGifInfo.ts

import fs from 'fs';
import { parseGIF, decompressFrames } from 'gifuct-js';

export async function getGifInfo(filePath: string): Promise<{
  width: number;
  height: number;
  frameCount: number;
}> {
  const buf = fs.readFileSync(filePath);
  const gif = parseGIF(buf);
  const frames = decompressFrames(gif, true);

  return {
    width: gif.lsd.width,
    height: gif.lsd.height,
    frameCount: frames.length
  };
}
