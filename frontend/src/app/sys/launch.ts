// File: frontend/src/app/sys/launch.ts

import type { Core, Engine } from '@index';

export async function launchApp(): Promise<{
  core: Core;
  engine: Engine;
}> {
  try {
    console.log(`Launching application...`);

    console.debug(`Initializing App Core...`);
    const { initializeCore } = await import('@sys_init/core.js');
    const core = await initializeCore();
    console.debug(`Successfully initialized the Application Core.`);

    console.debug(`Executing bootstrap processes...`);
    const { bootstrap } = await import('@bootstrap/main.js');
    await bootstrap(core);
    console.debug(`Bootstrap processes completed successfully.`);

    console.debug(`Initializing central App Engine...`);
    const { initializeEngine } = await import('@sys_init/engine.js');
    const engine = await initializeEngine(core);
    console.debug(`User Interface initialized successfully.`);

    console.debug(`Registering event listeners...`);
    const { eventListeners, registerEventListeners } = await import(
      '@sys_registries/events.js'
    );
    registerEventListeners(eventListeners, core, engine.renderingManager);
    console.debug(`Event listeners registered successfully.`);

    await engine.assetBrowserFns
      .render(core)
      .then(() =>
        console.debug(
          `Asset Browser Rendering SubEngine initialized successfully.`
        )
      );

    console.debug(`Initializing User Interface...`);
    const { UIManager } = await import('@engine/UIManager.js');
    const uiManager = UIManager.getInstance(
      core.services.cache,
      core,
      core.services.errors,
      engine.ioFns,
      engine.layerService,
      engine.renderingManager,
      core.services.stateManager
    );

    engine.uiManager = uiManager;

    return {
      core,
      engine
    };
  } catch (error) {
    console.error(
      `An unknown error occurred during application startup:`,
      error
    );
    throw new Error(`Application startup failed.`);
  }
}
