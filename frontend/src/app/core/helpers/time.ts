// File: frontend/src/app/cpre/helpers/time.ts

import type { Data, Helpers } from '../../types/index.js';

const { data } = await import('../../data/index.js');
const defaultDebounceWait: Data['config']['defaults']['debounceWait'] =
  data.config.defaults.debounceWait;

// ================================================== //

export const timeHelpersFactory = (): Helpers['time'] => ({
  debounce<T extends (...args: Record<string, unknown>[]) => void>(
    fn: T,
    wait?: number
  ): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    if (!wait) wait = defaultDebounceWait;

    return function (...args: Parameters<T>) {
      if (timeout) clearTimeout(timeout);

      timeout = setTimeout(() => fn(...args), wait);
    };
  }
});
