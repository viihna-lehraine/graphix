// File: frontend/src/app/sys/launch.ts

import type { AppDependencies } from '../types/index.js';

// ================================================== //
// ================================================== //

export async function launchApp(): Promise<{
  deps: AppDependencies;
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
    const { helpers, services, utils } = deps;
    const { log } = services;
    log.info(
      `Successfully created the Helpers, Services, and Utilities dependency objects.`,
      JSON.stringify({ helpers, services, utils }, null, 2)
    );

    // 3. Global One-Off Setup (error handlers, etc.)
    log.info(`Executing bootstrap processes...`);
    const { bootstrap } = await import('./bootstrap.js');
    await bootstrap(deps.services);
    log.info(`Bootstrap processes completed successfully.`);

    // 4. Register Event Listeners
    log.info(`Registering event listeners...`);
    const { eventListeners, registerEventListeners } = await import(
      './registries/events.js'
    );
    registerEventListeners(eventListeners, data, deps.services);
    log.info(`Event listeners registered successfully.`);

    // 5. Register Plugins
    log.info(`Registering plugins...`);
    const { plugins } = await import('./registries/plugins.js');
    for (const plugin of plugins) await plugin.register(deps);
    log.info(`Plugins registered successfully.`);

    // 6. Initialize UI overlays/widgets
    // log.info(`Initializing UI overlays and widgets...`);
    // const { uiInitializers } = await import('./registries/ui.js');
    // log.info(`UI overlays and widgets initialized successfully.`);

    // 7. Initialize User Interface
    log.info(`Initializing User Interface...`);
    const { initializeUI } = await import('./initialize.js');
    await initializeUI(data, deps);
    log.info(`User Interface initialized successfully.`);

    return {
      deps
    };
  } catch (error) {
    console.error(
      `An unknown error occurred during application startup:`,
      error
    );
    throw new Error(`Application startup failed.`);
  }
}
