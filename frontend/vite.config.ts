// File: frontend/vite.config.ts

import { defineConfig } from 'vite';
import path from 'path';

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
      '@bootstrap': path.resolve(import.meta.dirname, 'src/app/sys/bootstrap'),
      '@build': path.resolve(import.meta.dirname, 'src/app/build'),
      '@config': path.resolve(import.meta.dirname, 'src/app/config'),
      '@data': path.resolve(import.meta.dirname, 'src/app/data'),
      '@engine': path.resolve(import.meta.dirname, 'src/app/engine'),
      '@meta': path.resolve(import.meta.dirname, 'src/app/meta'),
      '@services': path.resolve(import.meta.dirname, 'src/app/services'),
      '@sys': path.resolve(import.meta.dirname, 'src/app/sys'),
      '@sys_init': path.resolve(import.meta.dirname, 'src/app/sys/init'),
      '@sys_launch': path.resolve(import.meta.dirname, 'src/app/sys/launch.js'),
      '@sys_registries': path.resolve(
        import.meta.dirname,
        'src/app/sys/registries'
      )
    },
    extensions: ['.js', '.mjs', '.ts', '.json']
  }
});
