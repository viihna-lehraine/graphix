// File: frontend/src/app/data/dom/classes.ts

import type { DomClasses } from '../../meta/index.js';

const assetThumb = 'asset-thumbnail';
const fontSelector = 'font-selector';
const textEditOverlay = 'text-edit-overlay';
const textColorPicker = 'text-color-picker';
const textSizeInput = 'text-size-input';

export const domClasses: DomClasses = {
  assetThumb,
  fontSelector,
  textColorPicker,
  textEditOverlay,
  textSizeInput
} as const;
