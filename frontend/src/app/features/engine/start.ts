// File: frontend/src/app/features/engine/start.ts

import type {
  Core,
  IOFunctions,
  OverlayFunctions,
  TextVisualLayer
} from '../../types/index.js';
import { RenderingEngine } from '../../features/engine/RenderingEngine.js';

let selectedTextIndex: number | null = null;
let dragging = false;
let dragOffset = { x: 0, y: 0 };
let isResizing = false;
let resizeTargetIndex: number | null = null;
let initialMouseY = 0;
let initialFontSize = 32;

function initAssetBrowserToggleBtn(core: Core): void {
  const {
    data: {
      dom: { ids }
    }
  } = core;
  const toggleBtn = document.getElementById(
    ids.toggleAssetBrowserBtn
  ) as HTMLButtonElement | null;
  const browser = document.getElementById(
    ids.assetBrowserDiv
  ) as HTMLDivElement | null;

  if (!toggleBtn) throw new Error(`Asset Browser Toggle Button not found!`);
  if (!browser) throw new Error(`Asset Browser Div not found!`);

  toggleBtn.addEventListener('click', () => {
    browser.classList.toggle('open');
  });

  document.addEventListener('click', (e: MouseEvent) => {
    if (!browser.contains(e.target as Node) && e.target !== toggleBtn) {
      browser.classList.remove('open');
    }
  });
}

function initClearBtn(core: Core): void {
  const {
    data: {
      dom: { ids }
    },
    services: { cache, errors, log, stateManager }
  } = core;

  return errors.handleSync(() => {
    const clearBtnId = ids.clearBtn;
    const btn = document.getElementById(clearBtnId) as HTMLButtonElement | null;

    if (!btn) throw new Error(`Canvas Clear Button not found!`);

    btn.addEventListener('click', () => {
      // 1. remove all text elements
      stateManager.clearCanvasAll();

      // 2. remove background image from state
      stateManager.setCanvasImage(undefined);
      stateManager.setCanvasAspectRatio(undefined);

      // 3. clear animations
      stateManager.clearCanvasAnimation();

      // 4. clear cached background image
      cache.cachedBgImg = null;
      const canvas = document.getElementById(
        ids.canvas
      ) as HTMLCanvasElement | null;
      if (!canvas) {
        throw new Error(`Canvas element not found in DOM!`);
      }
      stateManager.clearCanvasAll();

      log.info(
        `Canvas cleared and reset via StateManager.`,
        'initializeCanvasClearButton'
      );
    });

    log.debug(`Clear Button listener successfully attached.`);
  }, 'Unhandled Canvas Clear Button initialization error.');
}

// --------------------------------------------------- //

function initDownloadBtn(core: Core, io: IOFunctions): void {
  const {
    data: {
      dom: { ids },
      config: { defaults }
    },
    helpers,
    services: { errors, log, stateManager }
  } = core;

  return errors.handleSync(() => {
    const btnId = ids.downloadBtn;
    const btn = document.getElementById(btnId) as HTMLButtonElement | null;

    if (!btn) throw new Error(`Download button not found!`);

    btn.addEventListener('click', () => {
      const canvas = document.getElementById(
        ids.canvas
      ) as HTMLCanvasElement | null;
      if (!canvas) {
        throw new Error(`Canvas element not found in DOM!`);
      }
      const ctx = helpers.canvas.get2DContext(canvas);

      if (!ctx) {
        throw new Error(`Canvas 2D context not available.`);
        return;
      }

      const state = stateManager.getCanvas();
      const hasAnimatedLayer = state.layers.some(layer => layer.type === 'gif');

      const width = canvas.width;
      const height = canvas.height;
      const frameCount = defaults.animation.frameCount;
      const fileName = defaults.fileName || 'default.png';

      if (hasAnimatedLayer) {
        log.info(`AnimationLayer(s) detected - running GIF export pipeline...`);
        io.exportGif(state.layers, width, height, frameCount, core, fileName);
      } else {
        log.info(`Running static image export pipeline...`);
        io.exportStaticFile(state.layers, width, height, core, fileName);
      }
    });

    log.debug(`Download Button listener successfully attached.`);
  }, 'Unhandled Download Button initialization error.');
}

// --------------------------------------------------- //

function initTextInputForm(core: Core): void {
  const {
    data: {
      dom: { ids }
    },
    services: { errors, stateManager }
  } = core;

  return errors.handleSync(() => {
    const textForm = document.getElementById(
      ids.textForm
    ) as HTMLFormElement | null;
    const textInput = document.getElementById(
      ids.textInput
    ) as HTMLInputElement | null;

    if (!textForm) {
      throw new Error(`Text form not found in DOM.`);
    }
    if (!textInput) {
      throw new Error(`Text input not found in DOM.`);
    }

    // grab the canvas/context
    const canvas = document.getElementById(
      ids.canvas
    ) as HTMLCanvasElement | null;
    if (!canvas) {
      throw new Error(`Canvas element not found in DOM!`);
    }

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
        color: '#000000',
        align: 'center',
        baseline: 'middle'
      });

      textInput.value = '';
    });
  }, 'Unhandled Text Input Form initialization error.');
}

// --------------------------------------------------- //

async function initUploadBtn(core: Core, io: IOFunctions): Promise<void> {
  const {
    data: {
      dom: { ids }
    },
    services
  } = core;
  const { errors } = services;
  const { createGifAnimation } = await import('./animation.js');

  return errors.handleAsync(async () => {
    const uploadBtn = document.getElementById(
      ids.uploadBtn
    ) as HTMLButtonElement | null;
    const imgInput = document.getElementById(
      ids.imgUploadInput
    ) as HTMLInputElement | null;

    if (!uploadBtn) throw new Error('Upload button not found.');
    if (!imgInput) throw new Error('Image upload input not found.');

    // button click opens file dialog
    uploadBtn.addEventListener('click', () => imgInput.click());

    // file select triggers upload logic
    imgInput.addEventListener('change', () => {
      const file = imgInput.files?.[0];
      if (!file) return;

      io.handleUpload(file, core, createGifAnimation);
    });
  }, 'Failed to initialize upload UI.');
}

// --------------------------------------------------- //

function setupTextDragHandlers(
  canvas: HTMLCanvasElement,
  overlay: OverlayFunctions,
  core: Core,
  renderingEngine: RenderingEngine
): void {
  const { helpers, services } = core;
  const { errors, stateManager } = services;

  return errors.handleSync(() => {
    canvas.addEventListener('mousedown', (e: MouseEvent) => {
      dragging = false;
      isResizing = false;
      selectedTextIndex = null;
      resizeTargetIndex = null;

      const state = stateManager.getState();
      const mouse = helpers.canvas.getMousePosition(canvas, e);
      const ctx = canvas.getContext('2d')!;

      const textLayer = state.canvas.layers.find(
        (layer): layer is TextVisualLayer => layer.type === 'text'
      );

      if (!textLayer) return;

      for (let i = textLayer.textElements.length - 1; i >= 0; i--) {
        const elem = textLayer.textElements[i];

        if (helpers.canvas.isOverResizeHandle(mouse, elem, ctx)) {
          isResizing = true;
          resizeTargetIndex = i;
          initialMouseY = mouse.y;
          initialFontSize = elem.fontSize ?? 32;
          stateManager.setSelectedLayerIndex(i);

          return;
        }

        if (helpers.canvas.isPointInText(mouse, elem, ctx)) {
          selectedTextIndex = i;
          dragging = true;
          dragOffset.x = mouse.x - elem.x;
          dragOffset.y = mouse.y - elem.y;
          stateManager.setSelectedLayerIndex(i);
          break;
        }
      }
    });

    canvas.addEventListener('mousemove', (e: MouseEvent) => {
      const ctx = canvas.getContext('2d')!;
      const state = stateManager.getCanvas();

      const textLayer = state.layers.find(layer => layer.type === 'text') as
        | TextVisualLayer
        | undefined;

      if (!textLayer) return;

      if (isResizing && resizeTargetIndex !== null) {
        const elem = textLayer.textElements[resizeTargetIndex];
        const mouse = helpers.canvas.getMousePosition(canvas, e);
        const deltaY = mouse.y - initialMouseY;
        const newFontSize = Math.max(10, initialFontSize + deltaY);

        // update element
        const updatedElem = { ...elem, fontSize: newFontSize };
        textLayer.textElements[resizeTargetIndex] = updatedElem;

        renderingEngine.redraw(ctx, stateManager.getCanvas());
        return;
      }

      if (dragging && selectedTextIndex !== null) {
        const elem = textLayer.textElements[selectedTextIndex];
        const mouse = helpers.canvas.getMousePosition(canvas, e);

        const updatedElem = {
          ...elem,
          x: mouse.x - dragOffset.x,
          y: mouse.y - dragOffset.y
        };
        textLayer.textElements[selectedTextIndex] = updatedElem;

        renderingEngine.redraw(ctx, stateManager.getCanvas());
      }
    });

    canvas.addEventListener('mouseup', () => {
      dragging = false;
      isResizing = false;
      resizeTargetIndex = null;
    });

    canvas.addEventListener('mouseleave', () => {
      dragging = false;
      isResizing = false;
      resizeTargetIndex = null;
    });

    canvas.addEventListener('dblclick', (e: MouseEvent) => {
      const state = stateManager.getCanvas();
      const mouse = helpers.canvas.getMousePosition(canvas, e);

      const textLayer = state.layers.find(layer => layer.type === 'text') as
        | TextVisualLayer
        | undefined;

      if (!textLayer) return;

      for (let i = textLayer.textElements.length - 1; i >= 0; i--) {
        const elem = textLayer.textElements[i];

        if (
          helpers.canvas.isPointInText(mouse, elem, canvas.getContext('2d')!)
        ) {
          overlay.showTxtElemOverlay(canvas, elem, i, core, () =>
            renderingEngine.redraw(
              canvas.getContext('2d')!,
              stateManager.getCanvas()
            )
          );

          break;
        }
      }
    });
  }, 'Unhandled text drag handlers initialization error.');
}

// =================================================== //

export async function initializeCanvasUI(
  io: IOFunctions,
  overlay: OverlayFunctions,
  core: Core,
  renderingEngine: RenderingEngine
): Promise<void> {
  const {
    data: {
      dom: { ids }
    },
    services: { errors }
  } = core;
  const canvas = document.getElementById(
    ids.canvas
  ) as HTMLCanvasElement | null;

  if (!canvas) {
    throw new Error(`Canvas element not found in DOM!`);
  }

  return errors.handleAsync(async () => {
    initAssetBrowserToggleBtn(core);
    initClearBtn(core);
    initDownloadBtn(core, io);
    await initUploadBtn(core, io);
    initTextInputForm(core);
    setupTextDragHandlers(canvas, overlay, core, renderingEngine);
  }, 'Canvas UI initialization failed.');
}
