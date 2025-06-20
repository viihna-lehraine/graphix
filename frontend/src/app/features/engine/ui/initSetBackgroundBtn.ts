// File: frontend/src/app/features/engine/ui/initSetBackgroundBtn.ts

import type { Core, Engine } from '../../../types/index.js';

export async function initializeSetBackgroundBtn({
  core,
  engine
}: {
  core: Core;
  engine: Engine;
}): Promise<void> {
  const getElement = core.helpers.data.getElement;
  const ids = core.data.dom.ids;

  if (core.data.flags.false) console.debug(`NO_OP PRINT: ${engine}`);

  const btn = getElement(ids.setBackgroundBtn) as HTMLButtonElement;
  const input = getElement(ids.setBackgroundInput) as HTMLInputElement;

  btn.addEventListener('click', () => {
    core.services.stateManager.setUIState('uploadMode', 'background');
    input.click();
  });

  input.addEventListener('change', (_e: Event) => {
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      core.services.stateManager.setCanvasImage(
        reader.result as string,
        engine.renderingManager
      );
    };
    reader.readAsDataURL(file);
  });
}
