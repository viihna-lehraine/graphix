// File: frontend/src/app/features/canvas/ui/inputs/text.ts

import type {
  Data,
  Services,
  MainCanvasFunctions
} from '../../../../types/index.js';

// ================================================== //
// ================================================== //

export function initializeAddTextForm(
  data: Data,
  mainCanvasFns: MainCanvasFunctions,
  services: Services
): void {
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
  const canvas = mainCanvasFns.getMainCanvas(data, services);
  const ctx = mainCanvasFns.get2DContext(canvas, services);

  textForm.addEventListener('submit', (e: Event) => {
    e.preventDefault();

    const text = textInput.value.trim();
    if (!text) return;

    // basic font setup
    ctx.save();
    ctx.font = 'bold 32px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ff80c5'; // pink-ish

    // draw in the center of the canvas
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    ctx.restore();

    textInput.value = ''; // clear input after submission
  });
}
