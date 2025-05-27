// File: frontend/src/scripts/react/components/GraphicPreview.tsx

import '../../../styles/main.css';
import type { GraphicPreviewProps } from '../../types/index.js';
import { forwardRef, JSX } from 'react';

// =================================================== //
// =================================================== //

export const GraphicPreview = forwardRef<HTMLDivElement, GraphicPreviewProps>(
  ({ text, bgColor, textColor, sparkle }, ref): JSX.Element => {
    return (
      <div
        ref={ref}
        id="graphic-preview-div"
        style={{
          backgroundColor: bgColor,
          minHeight: '325px',
          minWidth: '100px',
          padding: '0 18px',
          transition: 'background 0.3s'
        }}
      >
        <span
          id="graphic-text-span"
          style={{
            color: textColor,
            letterSpacing: '2px',
            textShadow: '0 0 8px #fff, 0 0 2px #0007',
            WebkitTextStroke: '1px #fff4'
          }}
        >
          {text}
        </span>
        {sparkle && (
          <div
            id="sparkle-overlay"
            className="absolute inset-0 pointer-events-none z-10 animate-pulse select-none"
          >
            {/* simple SVG stars */}
            <svg width="100%" height="100%">
              <g>
                <circle cx="22" cy="15" r="3" fill="#fff" fillOpacity="0.8" />
                <circle cx="80" cy="8" r="2" fill="#ffe7fb" />
                <circle cx="160" cy="26" r="3.2" fill="#fff" fillOpacity="0.65" />
                <circle cx="110" cy="30" r="1.9" fill="#ffe7fb" />
                <circle cx="65" cy="20" r="2.4" fill="#fff" fillOpacity="0.7" />
              </g>
            </svg>
          </div>
        )}
      </div>
    );
  }
);

// add a display name for React DevTools
GraphicPreview.displayName = 'GraphicPreview';
