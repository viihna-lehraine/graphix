// File: frontend/src/app/core/utils/dom.ts

import { DOMUtils } from '../../types/index.js';

// ================================================== //
// ================================================== //

export const domUtilityFactory = (): DOMUtils => ({
  getCssVar(name: string): string {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(name)
      .trim();
  }
});
