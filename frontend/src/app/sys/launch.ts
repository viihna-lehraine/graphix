// File: frontend/src/app/sys/launch.ts

import type { Core, Engine } from '../types/index.js';

export async function launchApp(): Promise<{
  core: Core;
  engine: Engine;
}> {
  try {
    console.log(`Launching application...`);

    console.debug(`Initializing App Core...`);
    const { initializeCore } = await import('@init/core.js');
    const core = await initializeCore();
    console.debug(`Successfully initialized the Application Core.`);

    console.debug(`Executing bootstrap processes...`);
    const { bootstrap } = await import('@bootstrap/main.js');
    await bootstrap(core);
    console.debug(`Bootstrap processes completed successfully.`);

    console.debug(`Registering event listeners...`);
    const { eventListeners, registerEventListeners } = await import(
      '@sys_registries/events.js'
    );
    registerEventListeners(eventListeners, core);
    console.debug(`Event listeners registered successfully.`);

    console.debug(`Registering plugins...`);
    const { plugins } = await import('@sys_registries/plugins.js');
    for (const plugin of plugins) await plugin.register(core);
    console.debug(`Plugins registered successfully.`);

    console.debug(`Initializing central App Engine...`);
    const { initializeEngine } = await import('@init/engine.js');
    const engine = await initializeEngine(core);
    console.debug(`User Interface initialized successfully.`);

    await engine.assetBrowserFns
      .render(core)
      .then(() =>
        console.debug(
          `Asset Browser Rendering SubEngine initialized successfully.`
        )
      );

    console.debug(`Initializing User Interface...`);
    const { registerEngineUIInitializers } = await import(
      '@sys_registries/ui.js'
    );
    await registerEngineUIInitializers(core, engine);

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
