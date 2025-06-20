// File: frontend/src/app/features/engine/ui/initTextInputForm.ts

import type { Core, Engine } from '../../../types/index.js';

export async function initializeTextInputForm({
  core,
  engine
}: {
  core: Core;
  engine: Engine;
}): Promise<void> {
  if (core.data.flags.false) console.debug(`NO_OP PRINT: ${engine}`);

  const getElement = core.helpers.data.getElement;
  const ids = core.data.dom.ids;

  return core.services.errors.handleAsync(async () => {
    const textForm = getElement(ids.textForm) as HTMLFormElement;
    const textInput = getElement(ids.textInput) as HTMLInputElement;
    const canvas = getElement(ids.canvas) as HTMLCanvasElement;

    textForm.addEventListener('submit', (e: Event) => {
      e.preventDefault();

      const text = textInput.value.trim();
      if (!text) return;
      const position = { x: canvas.width / 2, y: canvas.height / 2 };

      core.services.stateManager.addTextElement({
        kind: 'text',
        id: crypto.randomUUID(),
        asset: core.data.assets.dummyTextAsset,
        text,
        position,
        align: 'center',
        baseline: 'middle',
        color: '#000000',
        font: 'bold 32px sans-serif',
        fontFamily: 'sans-serif',
        fontSize: 32,
        fontWeight: 'bold',
        fontStyle: 'normal',
        rotation: 0,
        scale: { x: 1, y: 1 },
        element: null
      });

      textInput.value = '';
    });
  }, 'Unhandled Text Input Form initialization error.');
}
