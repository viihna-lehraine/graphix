// File: frontend/src/app/main.ts

import('./sys/events/dom.js').then(({ onDOMContentLoaded }) => {
  onDOMContentLoaded(async () => {
    try {
      const { launchApp } = await import('@sys/launch.js');
      const { core, engine } = await launchApp();

      const canvas = document.getElementById(
        core.data.dom.ids.canvas
      ) as HTMLCanvasElement | null;
      if (!canvas) throw new Error('Canvas element not found in DOM!');

      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('2D context not available for canvas!');

      const animationTick = core.helpers.canvas.makeAnimationTick(
        engine,
        core.services.stateManager
      );

      requestAnimationFrame(animationTick);
    } catch (error) {
      console.error(
        `An unhandled error occurred during application startup:`,
        error instanceof Error ? error.message : error
      );
      throw new Error(`Application startup failed.`);
    }
  });
});

export {};
