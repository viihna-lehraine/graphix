// File: frontend/src/app/main.ts

import type { AppDependencies, CanvasRefs } from './types/index.js';

// ================================================== //
// ================================================== //

async function startApp(): Promise<AppDependencies> {
  try {
    const timestamp_1 = Date.now();
    console.log(`The application is starting up.`);
    console.log(`Started at: ${new Date(timestamp_1).toISOString()}`);

    console.log(
      `Loading 'Configuration' data - application's primary static data dependency object.`
    );
    const { data } = await import('./data/index.js');
    console.log(`Successfully loaded 'Configuration' data:`, JSON.stringify(data, null, 2));

    console.log(`Generating Helpers, Services, and Utilities`);
    const { initializeApp } = await import('./system/initialize.js');
    const { helpers, services, utilities } = await initializeApp();
    console.log(
      `Successfully created the Helpers, Services, and Utilities dependency objects.`,
      JSON.stringify({ helpers, services, utilities }, null, 2)
    );
    const log = services.log;
    log.info(`App initialization phase complete. Executing application bootstrap.`);
    const timestamp_2 = Date.now();
    const elapsedTime_1 = timestamp_2 - timestamp_1;
    log.info(
      `Timestamp: ${new Date(timestamp_2).toISOString()}\nElapsed time for initialization: ${elapsedTime_1} ms`
    );

    const timestamp_3 = Date.now();
    log.info(`Starting application bootstrap at: ${new Date(timestamp_3).toISOString()}`);
    const { bootstrap } = await import('./system/bootstrap.js');
    await bootstrap(services);
    log.info(`Application bootstrap complete. Constructing the AppDependencies object.`);
    const timestamp_4 = Date.now();
    const elapsedTime_2 = timestamp_4 - timestamp_3;
    log.info(
      `Timestamp: ${new Date(timestamp_4).toISOString()}\nElapsed time for bootstrap: ${elapsedTime_2} ms`
    );

    const timestamp_5 = Date.now();
    const deps: AppDependencies = {
      data,
      helpers,
      services,
      utilities
    } as const;
    const timestamp_6 = Date.now();
    const elapsedTime_3 = timestamp_6 - timestamp_5;
    log.info(
      `AppDependencies object created successfully.\nTimestamp: ${new Date(timestamp_6).toISOString()}\nElapsed time for AppDependencies creation: ${elapsedTime_3} ms`
    );

    return deps;
  } catch (error) {
    console.error(`An unknown error occurred during application startup:`, error);
    throw new Error(`Application startup failed.`);
  }
}

// =================================================== //
// =================================================== //

const { onDOMContentLoaded, onResize } = await import('./system/listeners/startup.js');

onDOMContentLoaded(async () => {
  let startupPromise: Promise<AppDependencies>;
  let deps: AppDependencies | null = null;
  let canvasRefs: CanvasRefs | void = void 0;

  try {
    startupPromise = startApp();
    deps = await startupPromise;
    const { data, services } = deps;

    const domElements = data.dom.elements;

    const { clearCanvas, getCanvasRefs, resizeCanvasToParent } = await import(
      './features/canvas/index.js'
    );

    canvasRefs = getCanvasRefs(domElements, services);

    if (!canvasRefs) {
      throw new Error(`Failed to get canvas references.`);
    } else if (!canvasRefs.canvas) {
      throw new Error(`Canvas element is not available.`);
    }

    resizeCanvasToParent(canvasRefs.canvas, services);
    clearCanvas(canvasRefs.ctx, services);

    onResize(async () => {
      const errors = deps.services.errors;
      const errorMsgs = deps.data.msgs.errors;

      errors.handleSync(() => {}, 'LOGIC NOT YET IMPLEMENTED. SLOW THE FUCK DOWN, SIS!', {
        context: 'application startup',
        fallback: 'n/a',
        userMessage: errorMsgs.unknownFatalError
      });
    });
  } catch (error) {
    console.error(
      `An error occurred during app startup:`,
      error instanceof Error ? error.message : error
    );
    throw new Error(`App startup failed.`);
  }
});
