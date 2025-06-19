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
      '@AnimationGroupManager': path.resolve(
        import.meta.dirname,
        'src/app/features/engine/AnimationGroupManager.js'
      ),
      '@bootstrap': path.resolve(import.meta.dirname, 'src/app/sys/bootstrap'),
      '@build': path.resolve(import.meta.dirname, 'src/app/build'),
      '@core': path.resolve(import.meta.dirname, 'src/app/core'),
      '@data': path.resolve(import.meta.dirname, 'src/app/data'),
      '@engine': path.resolve(import.meta.dirname, 'src/app/features/engine'),
      '@features': path.resolve(import.meta.dirname, '/src/app/features'),
      '@init': path.resolve(import.meta.dirname, 'src/app/sys/init'),
      '@launch': path.resolve(import.meta.dirname, 'src/app/sys/launch.js'),
      '@RenderingEngine': path.resolve(
        import.meta.dirname,
        'src/app/features/engine/RenderingEngine.js'
      ),
      '@services': path.resolve(import.meta.dirname, 'src/app/services'),
      '@sys': path.resolve(import.meta.dirname, 'src/app/sys'),
      '@sys_registries': path.resolve(
        import.meta.dirname,
        'src/app/sys/registries'
      ),
      '@types': path.resolve(import.meta.dirname, 'src/app/types')
    },
    extensions: ['.js', '.mjs', '.ts', '.json']
  }
});
