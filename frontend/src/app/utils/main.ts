// File: frontend/src/app/core/utils/main.ts

import type { AssetType, Data, Utilities } from '@index';
import { parseGIF, decompressFrames } from 'gifuct-js';

const { typeguardFactory } = await import('./typeguards.js');

const typeguards = typeguardFactory();

export const utilityFactory = (data: Data): Utilities => {
  return {
    typeguards,

    clone<T>(data: T): T {
      return structuredClone(data);
    },

    debounce<T extends (...args: Record<string, unknown>[]) => void>(
      fn: T,
      wait?: number
    ): (...args: Parameters<T>) => void {
      let timeout: ReturnType<typeof setTimeout> | null = null;
      if (!wait) wait = data.defaults.debounceWait;

      return function (...args: Parameters<T>) {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), wait);
      };
    },

    detectFileType(file: File): Promise<string | undefined> {
      const reader = new FileReader();
      return new Promise((resolve, reject) => {
        reader.onload = () => {
          const bytes = new Uint8Array(reader.result as ArrayBuffer);
          if (bytes[0] === 0x89 && bytes[1] === 0x50) return resolve('png');
          if (bytes[0] === 0xff && bytes[1] === 0xd8) return resolve('jpeg');
          if (bytes[0] === 0x47 && bytes[1] === 0x49) return resolve('gif');
          if (
            bytes[0] === 0x52 &&
            bytes[1] === 0x49 &&
            bytes[8] === 0x57 &&
            bytes[9] === 0x45
          )
            return resolve('webp');
          resolve(undefined);
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file.slice(0, 16));
      });
    },

    getAssetType(relPath: string, ext: string): AssetType {
      const rel = relPath.replace(/\\/g, '/').toLowerCase();
      if (rel.includes('/overlays/')) return 'overlay';
      if (ext === 'gif' || rel.includes('/gif/')) return 'gif';
      if (rel.includes('/borders/')) return 'border';
      if (rel.includes('/stickers/')) return 'sticker';
      if (rel.includes('/fonts/')) return 'font';
      if (rel.includes('/backgrounds/')) return 'background';
      return 'image';
    },

    getCssVar(name: string): string {
      return getComputedStyle(document.documentElement)
        .getPropertyValue(name)
        .trim();
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
            img.onload = () =>
              resolve({ width: img.width, height: img.height });
            img.onerror = () => resolve({ width: 0, height: 0 });
            img.src = reader.result as string;
          };
          reader.onerror = () => resolve({ width: 0, height: 0 });
          reader.readAsDataURL(file);
        } catch {
          resolve({ width: 0, height: 0 });
        }
      });
    },

    mapBlendMode(blendMode?: string): GlobalCompositeOperation {
      if (!blendMode || blendMode === 'normal') return 'source-over';
      return blendMode as GlobalCompositeOperation;
    },

    noop(): void {},

    async retry<T>(
      fn: () => Promise<T>,
      {
        attempts = 3,
        delayMs = 500,
        onError
      }: {
        attempts?: number;
        delayMs?: number;
        onError?: (err: unknown, attempt: number) => void;
      } = {}
    ): Promise<T> {
      let lastError: unknown;

      for (let attempt = 1; attempt <= attempts; attempt++) {
        try {
          return await fn();
        } catch (err) {
          lastError = err;
          onError?.(err, attempt);

          if (attempt < attempts) {
            await new Promise(resolve => setTimeout(resolve, delayMs));
          }
        }
      }

      throw lastError;
    }
  };
};
