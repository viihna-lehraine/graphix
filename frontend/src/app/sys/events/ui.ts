// File: frontend/src/app/sys/events/ui.ts

import type { Core, Engine } from '../../meta/index.js';

export async function addEngineUIEventListeners(
  core: Core,
  engine: Engine
): Promise<void> {
  const {
    data: { ids }
  } = core;
  const getElement = core.utils.getElement;
  const imgInput = getElement(ids.addImgInput) as HTMLInputElement;

  imgInput.addEventListener('change', async (e: Event) => {
    if (core.services.stateManager.getUIState().uploadMode === 'background') {
      const input = e.target as HTMLInputElement;
      const file = input.files && input.files[0];
      if (!file) return;

      const reader = new FileReader();

      reader.onload = () => {
        if (typeof reader.result !== 'string') {
          throw new Error('FileReader result is not a string!');
        }
        const img = new window.Image();
        img.onload = () => {
          const ctx = engine.renderingManager.getContext();
          engine.renderingManager.clearCanvas(ctx);
          engine.renderingManager.requestRedraw();
        };

        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  });
}
