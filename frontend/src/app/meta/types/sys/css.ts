// File: frontend/src/app/meta/types/sys/css.ts/

export interface TextStyle {
  font: {
    align?: 'left' | 'center' | 'right' | 'justify';
    baseline?: 'middle' | 'top' | 'bottom';
    color?: string;
    family?: string;
    size?: {
      value: number;
      unit: TextUnit;
    };
    weight?: 'normal' | 'bold';
  };
}

export type TextUnit = 'em' | 'pt' | 'px' | 'rem';
