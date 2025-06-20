// File: frontend/src/app/featutes/engine/ui/initAddImgBtn.ts

import type { Core, Engine } from '../../../types/index.js';

export async function initializeAddImgBtn({
  core,
  engine
}: {
  core: Core;
  engine: Engine;
}): Promise<void> {
  const getElement = core.helpers.data.getElement;
  const ids = core.data.dom.ids;

  const btn = getElement(ids.addImgBtn) as HTMLButtonElement;
  const input = getElement(ids.addImgInput) as HTMLInputElement;

  btn.addEventListener('click', () => {
    core.services.stateManager.setUIState('uploadMode', 'image');
    input.value = '';
    input.click();
  });

  input.addEventListener('change', async (_e: Event) => {
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();

    reader.onload = async () => {
      const layer = await engine.layerService.createImageLayer(
        reader.result as string,
        file
      );
      core.services.stateManager.addLayer(layer);
    };

    reader.readAsDataURL(file);
  });
}
