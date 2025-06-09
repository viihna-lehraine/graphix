// File: frontend/src/app/data/dom/classes.ts

import type { DomClasses } from '../../types/index.js';

const fontSelector = 'font-selector';
const textEditOverlay = 'text-edit-overlay';
const textColorPicker = 'text-color-picker';
const textSizeInput = 'text-size-input';

// =================================================== //

export const classes: DomClasses = {
  fontSelector,
  textColorPicker,
  textEditOverlay,
  textSizeInput
} as const;
