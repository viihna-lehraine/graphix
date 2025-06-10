// File: frontend/src/app/core/data/assets.ts

import type {
  AssetData,
  AssetExts,
  AssetTags,
  SupportedExt,
  SupportedExts,
  UnsupportedExt,
  UnsupportedExts
} from '../types/index.js';

const supportedExts: SupportedExts = [
  'gif',
  'jpeg',
  'jpg',
  'png',
  'webp'
] as readonly SupportedExt[];

const unsupportedExts: UnsupportedExts = ['svg'] as readonly UnsupportedExt[];

const exts: AssetExts = {
  supported: supportedExts,
  unsupported: unsupportedExts
} as const;

export const tags: AssetTags = ['animation', 'custom', 'rotate'] as const;

// ================================================== //

export const assetsData: AssetData = {
  exts,
  tags
} as const;
