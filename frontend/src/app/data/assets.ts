// File: frontend/src/app/core/data/assets.ts

import type { AssetData, Asset, AssetExts, AssetTags } from '../types/index.js';

const exts: AssetExts = {
  supported: ['gif', 'jpeg', 'jpg', 'png', 'webp'],
  unsupported: ['svg']
} as const;

const tags: AssetTags = ['animation', 'custom', 'rotate'] as const;

const dummyTextAsset: Asset = {
  type: 'text',
  name: 'DEFAULT',
  class: 'static',
  src: 'TEXT_ELEMENT',
  ext: 'TEXT_ELEMENT',
  tags: [],
  size_kb: 0,
  hash_sha256: 'N/A',
  credits: false,
  license: false,
  width: false,
  height: false,
  font: {
    family: 'san-serif',
    serif: false,
    style: 'normal',
    weight: 400
  },
  tileable: false,
  animation: false
};

// ================================================== //

export const assetsData: AssetData = {
  dummyTextAsset,
  exts,
  tags
} as const;
