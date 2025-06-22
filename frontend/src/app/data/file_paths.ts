// File: frontend/src/app/core/data/file_paths.ts

import type { FilePaths } from '../meta/index.js';

export const file_paths: FilePaths = {
  asset_manifest: '/assets/user/assets.manifest.json',
  gifWorkerScript: '/assets/scripts/gif.worker.js'
} as const;
