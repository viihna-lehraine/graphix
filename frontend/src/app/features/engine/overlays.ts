// FileL frontend/src/app/features/engine/overlays.ts

import type {
  Core,
  OverlayFunctions,
  TextLayerElement
} from '../../types/index.js';

function removeExistingOverlay(className: string): void {
  document.querySelectorAll(`.${className}`).forEach(e => e.remove());
}

function showTextElementOverlay(
  canvas: HTMLCanvasElement,
  elem: TextLayerElement,
  index: number,
  core: Core,
  redraw: () => void
): void {
  const {
    data: {
      dom: { classes }
    },
    services: { stateManager }
  } = core;
  const className = classes.textEditOverlay;

  removeExistingOverlay(className);

  // canvas/text position calc
  const rect = canvas.getBoundingClientRect();
  const ctx = canvas.getContext('2d')!;
  ctx.font = `${elem.fontWeight ?? 'bold'} ${elem.fontSize ?? 32}px ${elem.fontFamily ?? 'sans-serif'}`;
  const width = ctx.measureText(elem.text).width + 16;
  const height = (elem.fontSize ?? 32) + 8;
  const x =
    rect.left + elem.position.x * (rect.width / canvas.width) - width / 2;
  const y =
    rect.top + elem.position.y * (rect.height / canvas.height) - height / 2;

  // overlay
  const overlay = document.createElement('div');
  overlay.className = className;
  Object.assign(overlay.style, {
    position: 'absolute',
    left: `${x}px`,
    top: `${y + height + 10}px`, // below the text
    zIndex: '10000',
    padding: '12px',
    background: 'rgba(255,255,255,0.97)',
    border: '1.5px solid #b4b4b4',
    borderRadius: '8px',
    boxShadow: '0 2px 14px #0003',
    minWidth: '220px'
  });

  // text input
  const textInput = document.createElement('input');
  textInput.type = 'text';
  textInput.value = elem.text;
  textInput.style.width = '100%';

  // font select
  const fontSelect = document.createElement('select');
  fontSelect.className = classes.fontSelector;
  ['Arial', 'Impact', 'Comic Sans MS', 'Times New Roman'].forEach(f => {
    const opt = document.createElement('option');
    opt.value = f;
    opt.text = f;
    if (elem.fontFamily === f) opt.selected = true;
    fontSelect.appendChild(opt);
  });

  // size input
  const sizeInput = document.createElement('input');
  sizeInput.type = 'number';
  sizeInput.min = '8';
  sizeInput.max = '200';
  sizeInput.value = String(elem.fontSize);

  // color input
  const colorInput = document.createElement('input');
  colorInput.type = 'color';
  colorInput.value = elem.color;

  // save/cancel buttons
  const saveBtn = document.createElement('button');
  saveBtn.innerText = 'Done';
  saveBtn.type = 'button';
  const cancelBtn = document.createElement('button');
  cancelBtn.innerText = 'Cancel';
  cancelBtn.type = 'button';
  cancelBtn.style.marginLeft = '8px';

  // form layout
  overlay.append(
    'Text:',
    document.createElement('br'),
    textInput,
    document.createElement('br'),
    'Font:',
    document.createElement('br'),
    fontSelect,
    document.createElement('br'),
    'Size:',
    document.createElement('br'),
    sizeInput,
    document.createElement('br'),
    'Color:',
    document.createElement('br'),
    colorInput,
    document.createElement('br'),
    saveBtn,
    cancelBtn
  );

  // commit logic
  function commitEdit() {
    stateManager.updateTextElement(index, {
      ...elem,
      text: textInput.value,
      fontFamily: fontSelect.value,
      fontSize: parseInt(sizeInput.value, 10),
      color: colorInput.value as TextLayerElement['color']
    });
    overlay.remove();
    redraw();
  }
  // cancellation logic
  function cancelEdit() {
    overlay.remove();
    redraw();
  }

  saveBtn.addEventListener('click', commitEdit);
  cancelBtn.addEventListener('click', cancelEdit);
  overlay.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape') cancelEdit();
    if (e.key === 'Enter') commitEdit();
  });

  // focus logic
  setTimeout(() => textInput.focus(), 20);

  // attach to DOM
  document.body.appendChild(overlay);
}

// ================================================== //

export const overlayFns: OverlayFunctions = {
  removeExistingOverlay,
  showTxtElemOverlay: showTextElementOverlay
} as const;
