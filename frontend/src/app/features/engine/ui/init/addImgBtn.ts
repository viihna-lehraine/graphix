// File: frontend/src/app/featutes/engine/ui/init/addImgBtn.ts

import type { Core, Engine } from '../../../../types/index.js';

export async function initializeAddImgBtn({
  core,
  engine
}: {
  core: Core;
  engine: Engine;
}): Promise<void> {
  const btn = document.getElementById(
    core.data.dom.ids.addImgBtn
  ) as HTMLButtonElement | null;
  if (!btn) throw new Error('Add Image Button not found!');

  const input = document.getElementById(
    core.data.dom.ids.addImgInput
  ) as HTMLInputElement | null;
  if (!input) throw new Error('Image Upload Input not found!');

  const { setUploadMode } = await import('../uploadMode.js');

  btn.addEventListener('click', () => {
    setUploadMode('image');
    input.value = '';
    input.click();
  });

  input.addEventListener('change', async (_e: Event) => {
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();

    reader.onload = async () => {
      const layer = await engine.layerManager.createImageLayer(
        reader.result as string,
        file
      );
      core.services.stateManager.addLayer(layer);
    };

    reader.readAsDataURL(file);
  });
}
