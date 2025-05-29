// File: frontend/src/app/config/assets/index.ts

import type { AssetData } from '../../types/index.js';
import { tagsData } from './tags.js';
import { extensionData } from './ext.js';

// ================================================== //
// ================================================== //

export const assetsData: AssetData = {
  ext: extensionData,
  tags: tagsData
} as const;
