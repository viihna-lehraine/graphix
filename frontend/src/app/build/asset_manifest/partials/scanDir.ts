// File: frontend/src/app/build/asset_manifest/partials/scanDir.ts

import {
  AnimatedAssetProps,
  Asset,
  BackgroundExtra,
  BorderExtra,
  BlendMode,
  Data,
  FontExtra,
  GifExtra,
  ImageExtra,
  OverlayExtra,
  StickerExtra
} from '../../../types/index.js';
import fs from 'fs/promises';
import path from 'path';

export async function scanDir(
  dir: string,
  base: string = '',
  data: Data
): Promise<Asset[]> {
  const files: Asset[] = [];
  const entries = await fs.readdir(dir);

  for (const entry of entries) {
    const full = path.join(dir, entry);
    const rel = path.join(base, entry);

    const stat = await fs.stat(full);

    if (stat.isDirectory()) {
      const nestedFiles = await scanDir(full, rel, data);
      files.push(...nestedFiles);
    } else {
      if (entry.endsWith('.json')) continue;

      const ext = path.extname(entry).slice(1).toLowerCase();
      const { getFileInfo } = await import('./getFileInfo.js');
      const { getAssetClassAndFields } = await import(
        './getAssetClassAndFields.js'
      );
      const { readAssetMetadata } = await import('./readAssetMetadata.js');

      const { size_kb, hash_sha256 } = await getFileInfo(full);
      const { assetType, extra } = await getAssetClassAndFields(
        rel,
        ext,
        full,
        data
      );
      const assetMetadata = await readAssetMetadata(full);

      // ---------------------------
      // narrowing logic
      // ---------------------------

      let tileable: boolean = false;
      let width: number | false = false;
      let height: number | false = false;
      let blendMode: BlendMode = data.config.defaults.blendMode;
      let animation: AnimatedAssetProps | false = false;
      let font: Asset['font'] = false;

      switch (assetType) {
        case 'background':
        case 'border':
        case 'image':
          tileable =
            (extra as BackgroundExtra | BorderExtra | ImageExtra).tileable ??
            false;
          width =
            (extra as BackgroundExtra | BorderExtra | ImageExtra).width ??
            (false as false);
          height = (extra as BackgroundExtra | BorderExtra | ImageExtra).height;
          animation = (extra as BackgroundExtra | BorderExtra | ImageExtra)
            .animation;
          break;

        case 'gif':
          animation = (extra as GifExtra).animation;
          break;

        case 'font':
          font = (extra as FontExtra).font;
          break;

        case 'overlay':
          blendMode = (extra as OverlayExtra).blendMode;
          break;

        case 'sticker':
          width = (extra as StickerExtra).width;
          height = (extra as StickerExtra).height;
          animation = (extra as StickerExtra).animation;
          break;
      }

      // ---------------------------
      // build asset object
      // ---------------------------

      const asset: Asset = {
        type: assetType,
        name: path.basename(entry, '.' + ext),
        class: assetType === 'gif' ? 'animated' : 'static',
        src: '/assets/user/' + rel.replace(/\\/g, '/'),
        ext,
        tags: [],
        size_kb,
        hash_sha256,
        credits: '',
        license: '',
        tileable,
        width,
        height,
        blendMode,
        animation,
        font,
        ...assetMetadata // STRICT: overrides everything above
      };

      files.push(asset);
    }
  }

  files.forEach((asset, i) => {
    asset.index = i + 1;
  });
  return files;
}
