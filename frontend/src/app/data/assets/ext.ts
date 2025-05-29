// File: frontend/src/app/data/assets/ext.ts

import type { AllowedExtensions, ExtensionData } from '../../types/index.js';

// ================================================== //
// ================================================== //

const allowedExtensions: AllowedExtensions = [
  'gif',
  'jpeg',
  'jpg',
  'mp4',
  'png',
  'svg',
  'webp'
] as const;

// ================================================== //
// ================================================== //

export const extensionData: ExtensionData = {
  allowed: allowedExtensions
} as const;
