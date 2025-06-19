// File: frontend/src/app/sys/init/engine.ts

import type { Core, Engine } from '../../types/index.js';

export async function initializeEngine(core: Core): Promise<Required<Engine>> {
  return core.services.errors.handleAsync(async () => {
    const canvas = document.getElementById(
      core.data.dom.ids.canvas
    ) as HTMLCanvasElement | null;
    if (!canvas) throw new Error(`Canvas element not found in DOM!`);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error(`2D context not available for canvas!`);
    const container = document.getElementById(
      core.data.dom.ids.canvasContainerDiv
    );
    if (!container) throw new Error(`Canvas container not found in DOM!`);
    const canvasRefs = { canvas, ctx };

    const { initializeRenderingEngine } = await import(
      './partials/renderingEngine.js'
    );
    const renderingEngine = await initializeRenderingEngine(ctx, core);

    const { ioFns } = await import('@engine/io.js');
    const { overlayFns } = await import('@engine/overlays.js');

    const { animatedImageRedrawPlugin } = await import('@engine/plugins.js');
    renderingEngine.addRedrawPlugin(animatedImageRedrawPlugin);

    renderingEngine.autoResize({
      canvas,
      container,
      preserveAspectRatio: true
    });

    window.addEventListener('resize', () => {
      core.services.errors.handleSync(() => {
        renderingEngine.resizeCanvasToParent();
        renderingEngine.clearCanvas(canvasRefs.ctx);
        renderingEngine.drawBoundary(canvasRefs.ctx);
      }, 'Canvas resize/redraw failed');
    });

    const { AnimationGroupManager } = await import(
      '@engine/AnimationGroupManager.js'
    );
    const { LayerManager } = await import('@engine/LayerManager.js');

    const animationGroupManager = AnimationGroupManager.getInstance();
    const layerManager = LayerManager.getInstance(core.helpers);

    const { handlers } = await import('@engine/handlers.js');
    const { assetBrowserFns } = await import('@engine/asset_browser.js');

    return {
      animationGroupManager,
      assetBrowserFns,
      handlers,
      ioFns,
      layerManager,
      overlayFns,
      renderingEngine
    };
  }, `Engine/EngineUI initialization failed.`);
}
