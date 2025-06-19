// File: frontend/src/app/core/utils/data.ts

import type { AssetType, DataUtils } from '../../types/index.js';

export const dataUtilityFactory = (): DataUtils => ({
  detectFileType(file: File): Promise<string | undefined> {
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onload = () => {
        const bytes = new Uint8Array(reader.result as ArrayBuffer);
        if (bytes[0] === 0x89 && bytes[1] === 0x50) return resolve('png');
        if (bytes[0] === 0xff && bytes[1] === 0xd8) return resolve('jpeg');
        if (bytes[0] === 0x47 && bytes[1] === 0x49) return resolve('gif');
        if (
          bytes[0] === 0x52 &&
          bytes[1] === 0x49 &&
          bytes[8] === 0x57 &&
          bytes[9] === 0x45
        )
          return resolve('webp');
        resolve(undefined);
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file.slice(0, 16));
    });
  },

  getAssetType(relPath: string, ext: string): AssetType {
    const rel = relPath.replace(/\\/g, '/').toLowerCase();

    if (rel.includes('/overlays/')) return 'overlay' as AssetType;
    if (ext === 'gif' || rel.includes('/gif/')) return 'gif' as AssetType;
    if (rel.includes('/borders/')) return 'border' as AssetType;
    if (rel.includes('/stickers/')) return 'sticker' as AssetType;
    if (rel.includes('/fonts/')) return 'font' as AssetType;
    if (rel.includes('/backgrounds/')) return 'background' as AssetType;

    return 'image' as AssetType;
  }
});
