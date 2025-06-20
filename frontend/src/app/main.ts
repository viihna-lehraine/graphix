// File: frontend/src/app/main.ts

import('./sys/events/dom.js').then(({ onDOMContentLoaded }) => {
  onDOMContentLoaded(async () => {
    try {
      const { launchApp } = await import('@sys/launch.js');
      const { core, engine } = await launchApp();

      const _canvas = core.helpers.data.getElement(core.data.dom.ids.canvas);
      const ctx = engine.renderingManager.getContext();
      if (!ctx) throw new Error('2D context not available for canvas!');

      const animationTick = engine.renderingManager.makeAnimationTick(
        engine.animationGroupManager,
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
