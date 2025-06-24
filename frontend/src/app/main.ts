// File: frontend/src/app/main.ts

import('@dom_events').then(async ({ onDOMContentLoaded }) => {
  const { error_classes } = await import('@index');
  const AppStartupError = error_classes.AppStartupError;

  onDOMContentLoaded(async () => {
    try {
      const { launchApp } = await import('@launch');

      const { core, engine } = await launchApp();

      const animationTick = engine.renderingManager.makeAnimationTick(
        engine.animationManager,
        core.services.stateManager
      );

      requestAnimationFrame(animationTick);
    } catch (error) {
      alert(
        `An error occurred during application startup: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
      throw new AppStartupError('main application loop');
    }
  });
});

export {};
