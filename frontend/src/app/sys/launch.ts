// File: frontend/src/app/sys/launch.ts

import type { Core } from '../types/index.js';
import { RenderingEngine } from '../features/engine/RenderingEngine.js';

export async function launchApp(): Promise<{
  core: Core;
  renderingEngine: RenderingEngine;
}> {
  try {
    console.log(`Launching application...`);

    // 1. Load Static Data
    console.log(`Loading static Data object...`);
    const { initializeData } = await import('./initialize.js');
    const data = await initializeData();
    console.log(
      `Successfully loaded static Data object: ${JSON.stringify(data, null, 2)}`
    );

    // 2. Initialize App Core
    console.log(`Initializing App Core...`);
    const { initializeCore } = await import('./initialize.js');
    const core = await initializeCore();
    const {
      services: { log }
    } = core;
    log.info(
      `Successfully initialized the Application Core.`,
      JSON.stringify(core, null, 2)
    );

    // 3. Global One-Off Setup (error handlers, etc.)
    log.info(`Executing bootstrap processes...`);
    const { bootstrap } = await import('./bootstrap.js');
    await bootstrap(core);
    log.info(`Bootstrap processes completed successfully.`);

    // 4. Register Event Listeners
    log.info(`Registering event listeners...`);
    const { eventListeners, registerEventListeners } = await import(
      './registries/events.js'
    );
    registerEventListeners(eventListeners, core);
    log.info(`Event listeners registered successfully.`);

    // 5. Register Plugins
    log.info(`Registering plugins...`);
    const { plugins } = await import('./registries/plugins.js');
    for (const plugin of plugins) await plugin.register(core);
    log.info(`Plugins registered successfully.`);

    // 6. Initialize User Interface
    log.info(`Initializing User Interface...`);
    const { initializeUI } = await import('./initialize.js');
    await initializeUI(core);
    log.info(`User Interface initialized successfully.`);

    // 7. Initialize Rendering Engine
    log.info(`Initializing Rendering Engine...`);
    const { initializeRenderingEngine } = await import('./initialize.js');
    const ctx = document.querySelector('canvas')?.getContext('2d');
    if (!ctx) {
      throw new Error(`Failed to get 2D context from canvas element.`);
    }
    const renderingEngine = await initializeRenderingEngine(ctx, core);

    // 8. Initialise Asset Browser Rendering SubEngine
    log.info(`Initializing Asset Browser Rendering SubEngine...`);
    const { renderAssetBrowser } = await import(
      '../features/engine/asset_browser.js'
    );
    await renderAssetBrowser(core).then(() =>
      log.info(`Asset Browser Rendering SubEngine initialized successfully.`)
    );

    return {
      core,
      renderingEngine
    };
  } catch (error) {
    console.error(
      `An unknown error occurred during application startup:`,
      error
    );
    throw new Error(`Application startup failed.`);
  }
}
