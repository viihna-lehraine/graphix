// File: frontend/src/app/sys/init/engine.ts

import type { Core, Engine } from '../../types/index.js';

export async function initializeEngine(core: Core): Promise<Required<Engine>> {
  return core.services.errors.handleAsync(async () => {
    const {
      data: {
        dom: { ids }
      },
      helpers
    } = core;
    const getElement = helpers.data.getElement;

    const canvas = getElement(ids.canvas) as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error(`2D context not available for canvas!`);
    const container = getElement(ids.canvasContainerDiv);

    const canvasRefs = { canvas, ctx };

    const { AnimationGroupManager } = await import(
      '@engine/AnimationGroupManager.js'
    );
    const animationGroupManager = AnimationGroupManager.getInstance();

    const { initializeRenderingManager } = await import('./partials.js');
    const renderingManager = await initializeRenderingManager(
      ctx,
      animationGroupManager,
      core
    );

    const { ioFns } = await import('@engine/io.js');

    const { animatedImageRedrawPlugin } = await import('@engine/plugins.js');
    renderingManager.addRedrawPlugin(animatedImageRedrawPlugin);

    renderingManager.autoResize({
      canvas,
      container,
      preserveAspectRatio: true
    });

    window.addEventListener('resize', () => {
      core.services.errors.handleSync(() => {
        renderingManager.resizeCanvasToParent();
        renderingManager.clearCanvas(canvasRefs.ctx);
        renderingManager.drawBoundary(canvasRefs.ctx);
      }, 'Canvas resize/redraw failed');
    });

    const { LayerService } = await import('@engine/LayerService.js');

    const layerService = LayerService.getInstance(core.helpers);

    const { handlers } = await import('@engine/handlers.js');
    const { assetBrowserFns } = await import('@engine/asset_browser.js');

    return {
      animationGroupManager,
      assetBrowserFns,
      handlers,
      ioFns,
      layerService,
      renderingManager
    };
  }, `Engine/EngineUI initialization failed.`);
}
