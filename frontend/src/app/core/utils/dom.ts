// File: frontend/src/app/core/utils/dom.ts

import { DomUtils } from '../../types/index.js';

export const domUtilityFactory = (): DomUtils => ({
  getCssVar(name: string): string {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(name)
      .trim();
  }
});
