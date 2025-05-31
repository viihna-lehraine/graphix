// File: frontend/src/app/main.ts

// =================================================== //
// =================================================== //

const { onDOMContentLoaded } = await import('./sys/events/dom.js');

onDOMContentLoaded(async () => {
  try {
    const { launchApp } = await import('./sys/launch.js');
    await launchApp();
  } catch (error) {
    console.error(
      `An unhandled error occurred during application startup:`,
      error instanceof Error ? error.message : error
    );
    throw new Error(`Startup failed.`);
  }
});

// =================================================== //

export {};
