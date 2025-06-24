// File: frontend/src/app/core/data/file_paths.ts

import type { FilePaths } from '@index';

export const file_paths: FilePaths = {
  asset_manifest: '/assets/user/assets.manifest.json',
  gif_worker_script: '/assets/scripts/gif.worker.js'
} as const;
