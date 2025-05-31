// File: frontend/src/app/sys/launch.ts

import type { AppDependencies, CanvasFunctions, Data } from '../types/index.js';
import { ResizeManager } from '../dom/ResizeManager.js';
import { StateManager } from '../state/StateManager.js';

// ================================================== //
// ================================================== //

export async function launchApp(): Promise<{
  data: Data;
  canvasFns: CanvasFunctions;
  deps: AppDependencies;
  resizeManager: ResizeManager;
  stateManager: StateManager;
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

    // 2. Initialize App Dependencies (helpers, services, utilities)
    console.log(`Initializing App Dependencies...`);
    const { initializeAppDependencies } = await import('./initialize.js');
    const deps = await initializeAppDependencies();
    const { helpers, services, utilities } = deps;
    const { log } = services;
    log.info(
      `Successfully created the Helpers, Services, and Utilities dependency objects.`,
      JSON.stringify({ helpers, services, utilities }, null, 2)
    );

    // 3. Initialize State Manager
    log.info(`Initializing State Manager...`);
    const { StateManager } = await import('../state/StateManager.js');
    const stateManager = StateManager.getInstance(
      data,
      services.errors,
      services.log
    );
    log.info(`State Manager initialized successfully.`);

    // 4. Initialize Resize Manager
    log.info(`Initializing Resize Manager...`);
    const { ResizeManager } = await import('../dom/ResizeManager.js');
    const resizeManager = ResizeManager.getInstance(services);
    log.info(`Resize Manager initialized successfully.`);

    /// 5. Global One-Off Setup (error handlers, etc.)
    log.info(`Executing bootstrap processes...`);
    const { bootstrap } = await import('./bootstrap.js');
    await bootstrap(deps.services);
    log.info(`Bootstrap processes completed successfully.`);

    // 6. Register Event Listeners
    log.info(`Registering event listeners...`);
    const { eventListeners, registerEventListeners } = await import(
      './registries/events.js'
    );
    registerEventListeners(eventListeners, data, deps.services);
    log.info(`Event listeners registered successfully.`);

    // 7. Register Plugins
    log.info(`Registering plugins...`);
    const { plugins } = await import('./registries/plugins.js');
    for (const plugin of plugins) await plugin.register(deps);
    log.info(`Plugins registered successfully.`);

    // 8. Initialize UI overlays/widgets
    // log.info(`Initializing UI overlays and widgets...`);
    // const { uiInitializers } = await import('./registries/ui.js');
    // log.info(`UI overlays and widgets initialized successfully.`);

    // 9. Initialize User Interface
    log.info(`Initializing User Interface...`);
    const { initializeUI } = await import('./initialize.js');
    const canvasFns = await initializeUI(data, deps);
    log.info(`User Interface initialized successfully.`);

    return {
      data,
      canvasFns,
      deps,
      resizeManager,
      stateManager
    };
  } catch (error) {
    console.error(
      `An unknown error occurred during application startup:`,
      error
    );
    throw new Error(`Application startup failed.`);
  }
}
