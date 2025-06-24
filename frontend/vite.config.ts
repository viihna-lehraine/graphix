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
      '@dom_events': path.resolve(
        import.meta.dirname,
        'src/app/sys/events/dom.js'
      ),
      '@engine': path.resolve(import.meta.dirname, 'src/app/engine'),
      '@index': path.resolve(import.meta.dirname, 'src/app/meta/index.js'),
      '@launch': path.resolve(import.meta.dirname, 'src/app/sys/launch.js'),
      '@meta': path.resolve(import.meta.dirname, 'src/app/meta'),
      '@meta_errors': path.resolve(import.meta.dirname, 'src/app/meta/errors'),
      '@meta_types': path.resolve(import.meta.dirname, 'src/app/meta/types'),
      '@services': path.resolve(import.meta.dirname, 'src/app/services'),
      '@sys': path.resolve(import.meta.dirname, 'src/app/sys'),
      '@sys_init': path.resolve(import.meta.dirname, 'src/app/sys/init'),
      '@sys_launch': path.resolve(import.meta.dirname, 'src/app/sys/launch.js'),
      '@sys_registries': path.resolve(
        import.meta.dirname,
        'src/app/sys/registries'
      ),
      '@utils': path.resolve(import.meta.dirname, 'src/app/utils')
    },
    extensions: ['.js', '.mjs', '.ts', '.json']
  }
});
