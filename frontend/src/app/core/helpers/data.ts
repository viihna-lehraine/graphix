// File: frontend/src/app/core/helpers/data.ts

import type { DataHelpers, DebounceOptions } from '../../types/index.js';
import { parseGIF, decompressFrames } from 'gifuct-js';

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

  getFileExtension(file: File | Blob): string {
    if (file instanceof File) {
      const parts = file.name.split('.');
      return parts.length > 1 ? parts.pop() || '' : '';
    } else if (file instanceof Blob) {
      return file.type.split('/')[1] || '';
    } else {
      return '';
    }
  },

  getFileSizeInKB(file: File | Blob): number {
    try {
      return file.size ? Math.round(file.size / 1024) : 0;
    } catch (error) {
      console.error(`Error getting file size for the file ${file}:`, error);
      return 0;
    }
  },

  async getFileSHA256(file: File | Blob): Promise<string> {
    const buf = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buf);
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  },

  getFileName(file: File | Blob): string {
    if (file instanceof File) {
      return file.name;
    } else if (file instanceof Blob) {
      return file.type ? `blob_${Date.now()}` : `blob_${crypto.randomUUID()}`;
    } else {
      return `file_upload_${crypto.randomUUID()}`;
    }
  },

  getFormattedTimestamp(): string {
    return new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  },

  async getGifInfo(file: File | Blob): Promise<{
    width: number;
    height: number;
    frameCount: number;
  }> {
    const buf = await file.arrayBuffer();
    const gif = parseGIF(buf);
    const frames = decompressFrames(gif, true);

    return {
      width: gif.lsd.width,
      height: gif.lsd.height,
      frameCount: frames.length
    };
  },

  getElement<T extends HTMLElement = HTMLElement>(id: string): T {
    const element = document.getElementById(id);
    if (!element) throw new Error(`Element with ID '${id}' not found`);
    return element as T;
  },

  async getImageDimensions(file: File | Blob): Promise<{
    width: number;
    height: number;
  }> {
    return new Promise((resolve, _reject) => {
      try {
        const reader = new FileReader();
        reader.onload = () => {
          const img = new Image();

          img.onload = () => {
            resolve({ width: img.width, height: img.height });
          };
          img.onerror = () => resolve({ width: 0, height: 0 });
          img.src = reader.result as string;
        };
        reader.onerror = () => resolve({ width: 0, height: 0 });
        reader.readAsDataURL(file);
      } catch {
        resolve({ width: 0, height: 0 });
      }
    });
  }
});
