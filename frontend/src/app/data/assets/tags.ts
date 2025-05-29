// File: frontend/src/app/data/assets/tags.ts

import type { AssetTagsData, BaseAssetTags } from '../../types/index.js';

// ================================================== //
// ================================================== //

const baseTags: BaseAssetTags = ['animation', 'custom', 'rotate'] as const;

// ================================================== //
// ================================================== //

export const tagsData: AssetTagsData = {
  base: baseTags
} as const;
