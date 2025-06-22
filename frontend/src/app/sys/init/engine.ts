// File: frontend/src/app/sys/init/engine.ts

import type { Core, Engine } from '@meta/index.js';

export async function initializeEngine(core: Core): Promise<Required<Engine>> {
  return core.services.errors.handleAsync(async () => {
    const canvas = core.utils.getElement(
      core.data.ids.canvas
    ) as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    if (!ctx) throw new Error(`2D context not available for canvas!`);

    const container = core.utils.getElement(core.data.ids.canvasContainerDiv);

    const canvasRefs = { canvas, ctx };

    const { AnimationManager } = await import(
      'src/app/engine/AnimationManager.js'
    );
    const animationManager = AnimationManager.getInstance();

    const { initializeRenderingManager } = await import('./partials.js');
    const renderingManager = await initializeRenderingManager(
      ctx,
      animationManager,
      core
    );

    const { ioFns } = await import('src/app/engine/io.js');

    const { animatedImageRedrawPlugin } = await import(
      'src/app/engine/plugins.js'
    );
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

    const { LayerService } = await import('src/app/engine/LayerService.js');

    const layerService = LayerService.getInstance(core.utils);

    const { handlers } = await import('src/app/engine/handlers.js');
    const { assetBrowserFns } = await import('src/app/engine/asset_browser.js');

    const stateManager = core.services.stateManager;

    const { UIManager } = await import('src/app/engine/UIManager.js');
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
