// File: frontend/src/scripts/types/react.ts

import React from 'react';

// ================================================== //
// ================================================== //

export interface DownloadButtonProps {
  targetRef: React.RefObject<HTMLDivElement | null>;
  fileName?: string;
}

// ================================================== //

export interface GraphicPreviewProps {
  text: string;
  bgColor: string;
  textColor: string;
  sparkle: boolean;
}

// ================================================== //

export interface SparkleCheckboxProps {
  sparkle: boolean;
  setSparkle: (value: boolean) => void;
}
