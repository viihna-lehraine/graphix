// File: frontend/src/app/types/css.ts/

import type { Hex } from './index.js';

// ================================================== //

export type TextUnit = 'em' | 'pt' | 'px' | 'rem';

export interface TextStyle {
  font: {
    align?: 'left' | 'center' | 'right' | 'justify';
    baseline?: 'middle' | 'top' | 'bottom';
    color?: Hex;
    family?: string;
    size?: {
      value: number;
      unit: TextUnit;
    };
    weight?: 'normal' | 'bold';
  };
}

export interface Styles {
  text: TextStyle[];
}
