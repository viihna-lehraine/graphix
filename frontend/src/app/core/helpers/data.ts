// File: frontend/src/app/core/helpers/data.ts

import type { DataHelpers, DebounceOptions } from '../../types/index.js';

export const dataHelperFactory = async (): Promise<DataHelpers> => ({
  clone<T>(data: T): T {
    return structuredClone(data);
  },

  debounce<T extends (...args: unknown[]) => void>(
    fn: T,
    waitMs: number,
    options: DebounceOptions = {}
  ): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let lastArgs: Parameters<T> | null = null;
    let lastCallTime = 0;
    let maxTimeoutId: ReturnType<typeof setTimeout> | null = null;

    const invoke = () => {
      if (lastArgs) {
        fn(...lastArgs);
        lastArgs = null;
        lastCallTime = Date.now();
      }
    };

    const cancelTimers = () => {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      if (maxTimeoutId !== null) {
        clearTimeout(maxTimeoutId);
        maxTimeoutId = null;
      }
    };

    return (...args: Parameters<T>) => {
      const now = Date.now();
      const isInvokingLeading = options.leading && !timeoutId;

      lastArgs = args;

      if (isInvokingLeading) {
        invoke();
      }

      cancelTimers();

      if (options.maxWaitMs !== undefined) {
        const timeSinceLastCall = now - lastCallTime;
        const remainingMaxWait = options.maxWaitMs - timeSinceLastCall;

        if (remainingMaxWait <= 0) {
          invoke();
        } else {
          maxTimeoutId = setTimeout(() => {
            invoke();
          }, remainingMaxWait);
        }
      }

      if (!isInvokingLeading || options.trailing) {
        timeoutId = setTimeout(() => {
          if (!options.leading || options.trailing) {
            invoke();
          }
          timeoutId = null;
        }, waitMs);
      }
    };
  },

  getFileSizeInKB(file: File | Blob): number {
    return Math.round(file.size / 1024);
  },

  async getFileSHA256(file: File | Blob): Promise<string> {
    const buf = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buf);
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
});
