// File: frontend/src/app/types/css.ts/

import type { Hex } from './index.js';

// ================================================== //
// ================================================== //+

export interface TextStyle {
  font: {
    family?: string;
    size?: {
      value: number;
      unit: string; // e.g., 'px', 'em', 'rem'
    };
    align?: 'left' | 'center' | 'right' | 'justify';
    weight?: 'normal' | 'bold';
    baseline?: 'middle' | 'top' | 'bottom';
    color?: Hex;
  };
}

export interface Styles {
  text: TextStyle[];
}
