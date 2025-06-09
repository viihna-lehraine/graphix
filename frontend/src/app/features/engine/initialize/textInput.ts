// File: frontend/src/app/features/engine/initialize/textInput.ts

import type { Data, Hex, Services, Utilities } from '../../../types/index.js';

// ================================================== //

export function initializeTextInputForm(
  data: Data,
  services: Services,
  utils: Utilities
): void {
  const { errors, stateManager } = services;

  return errors.handleSync(() => {
    const textForm = document.getElementById(
      data.dom.ids.forms.text
    ) as HTMLFormElement | null;
    const textInput = document.getElementById(
      data.dom.ids.inputs.text
    ) as HTMLInputElement | null;

    if (!textForm) {
      throw new Error(`Text form not found in DOM.`);
    }
    if (!textInput) {
      throw new Error(`Text input not found in DOM.`);
    }

    // grab the canvas/context
    const canvas = utils.canvas.getCanvasElement();

    textForm.addEventListener('submit', (e: Event) => {
      e.preventDefault();

      const text = textInput.value.trim();
      if (!text) return;

      stateManager.addTextElement({
        text,
        x: canvas.width / 2,
        y: canvas.height / 2,
        font: 'bold 32px sans-serif',
        fontSize: 32,
        color: '#000000' as Hex,
        align: 'center',
        baseline: 'middle'
      });

      textInput.value = '';
    });
  }, 'Unhandled Text Input Form initialization error.');
}
