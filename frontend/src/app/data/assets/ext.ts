// File: frontend/src/app/data/assets/ext.ts

import type {
  ExtensionData,
  SupportedExt,
  SupportedExts,
  UnsupportedExt,
  UnsupportedExts
} from '../../types/index.js';

// ================================================== //

const supportedExts: SupportedExts = [
  'gif',
  'jpeg',
  'jpg',
  'png',
  'webp'
] as readonly SupportedExt[];

const unsupportedExts: UnsupportedExts = ['svg'] as readonly UnsupportedExt[];

// ================================================== //

export const extensionData: ExtensionData = {
  supported: supportedExts,
  unsupported: unsupportedExts
} as const;
