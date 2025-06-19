// File: frontend/src/app/sys/init/partials/renderingEngine.ts

import type { Core } from '../../../types/index.js';
import { RenderingEngine } from '@engine/RenderingEngine.js';

export async function initializeRenderingEngine(
  ctx: CanvasRenderingContext2D,
  core: Core
): Promise<RenderingEngine> {
  return core.services.errors.handleAsync(async () => {
    console.debug('Initializing the Rendering Engine...');
    const renderingEngine = RenderingEngine.getInstance(ctx, core);

    return renderingEngine;
  }, `Rendering Engine initialization failed.`);
}
