// File: frontend/src/app/sys/init/engine.ts

import type { Core, Engine } from '@index';

export async function initializeEngine(core: Core): Promise<Required<Engine>> {
  return core.services.errors.handleAsync(async () => {
    const canvas = core.utils.getElement(
      core.data.ids.canvas
    ) as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    if (!ctx) throw new Error(`2D context not available for canvas!`);

    const container = core.utils.getElement(core.data.ids.canvasContainerDiv);

    const canvasRefs = { canvas, ctx };

    const { AnimationManager } = await import('@engine/AnimationManager.js');
    const animationManager = AnimationManager.getInstance();

    const { initializeRenderingManager } = await import(
      '@sys_init/partials.js'
    );
    const renderingManager = await initializeRenderingManager(
      ctx,
      animationManager,
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

    const layerService = LayerService.getInstance(core.utils);

    const { handlers } = await import('@engine/handlers.js');
    const { assetBrowserFns } = await import('@engine/asset_browser.js');

    const stateManager = core.services.stateManager;

    const { UIManager } = await import('@engine/UIManager.js');
    const uiManager = UIManager.getInstance(
      core.services.cache,
      core,
      core.services.errors,
      ioFns,
      layerService,
      renderingManager,
      stateManager
    );

    return {
      animationManager,
      assetBrowserFns,
      handlers,
      ioFns,
      layerService,
      renderingManager,
      uiManager
    };
  }, `Engine initialization failed.`);
}
