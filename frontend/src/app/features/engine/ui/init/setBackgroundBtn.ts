// File: frontend/src/app/features/engine/ui/setBackgroundBtn.ts

import type { Core, Engine } from '../../../../types/index.js';

export async function initializeSetBackgroundBtn({
  core,
  engine
}: {
  core: Core;
  engine: Engine;
}): Promise<void> {
  if (core.data.flags.false) console.debug(`NO_OP PRINT: ${engine}`);

  const btn = document.getElementById(
    core.data.dom.ids.setBackgroundBtn
  ) as HTMLButtonElement | null;
  if (!btn) throw new Error('Set Background Button not found!');
  const input = document.getElementById(
    core.data.dom.ids.setBackgroundInput
  ) as HTMLInputElement | null;
  if (!input) throw new Error('Set Background Input not found!');

  const { setUploadMode } = await import('../uploadMode.js');

  btn.addEventListener('click', () => {
    setUploadMode('background');
    input.click();
  });

  input.addEventListener('change', (_e: Event) => {
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      core.services.stateManager.setCanvasImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  });
}
