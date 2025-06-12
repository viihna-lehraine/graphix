// File: frontend/vite.config.ts

import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// *************************************************** //

export default defineConfig({
  root: 'src',
  publicDir: '../public',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    target: 'esnext'
  },
  server: {
    host: '0.0.0.0',
    port: 5183,
    strictPort: true,
    open: true
  },
  resolve: {
    alias: {
      '@core': path.resolve(__dirname, 'src/app/core'),
      '@data': path.resolve(__dirname, 'src/app/data'),
      '@engine': path.resolve(__dirname, 'src/app/features/engine'),
      '@features': path.resolve(__dirname, '/src/app/features'),
      '@sys': path.resolve(__dirname, 'src/app/sys'),
      '@types': path.resolve(__dirname, 'src/app/types')
    },
    extensions: ['.js', '.mjs', '.ts', '.json']
  }
});
