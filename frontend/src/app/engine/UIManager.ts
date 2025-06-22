// File: frontend/src/app/engine/UIManager.ts

import type {
  AssetData,
  Core,
  Defaults,
  DomIds,
  IOFunctions,
  LayerElement,
  StateManager,
  Typeguards,
  UIManagerContract,
  Utilities
} from '../meta/index.js';
import {
  CacheManager,
  ErrorHandler,
  LayerService,
  RenderingManager
} from '../meta/index.js';

export class UIManager implements UIManagerContract {
  static #instance: UIManager | null = null;

  #assets: AssetData;
  #cache: CacheManager;
  #core: Core;
  #defaults: Defaults;
  #ids: DomIds;
  #ioFns: IOFunctions;
  #layerService: LayerService;
  #renderingManager: RenderingManager;
  #stateManager: StateManager;
  #syncErrorHandler: ErrorHandler['handleSync'];
  #typeguards: Typeguards;

  #getElement: Utilities['getElement'];

  private constructor(
    cache: CacheManager,
    core: Core,
    errorHandler: ErrorHandler,
    ioFns: IOFunctions,
    layerService: LayerService,
    renderingManager: RenderingManager,
    stateManager: StateManager
  ) {
    console.debug(`Creating UIManager instance.`);

    this.#assets = core.data.assets;
    this.#cache = cache;
    this.#core = core;
    this.#defaults = core.data.defaults;
    this.#getElement = core.utils.getElement;
    this.#ids = core.data.ids;
    this.#ioFns = ioFns;
    this.#layerService = layerService;
    this.#renderingManager = renderingManager;
    this.#stateManager = stateManager;
    this.#syncErrorHandler = errorHandler.handleSync.bind(errorHandler);
    this.#typeguards = core.utils.typeguards;

    this.initialize();
    console.debug(`UIManager instance created and initialized.`);
  }

  static getInstance(
    cache: CacheManager,
    core: Core,
    errorHandler: ErrorHandler,
    ioFns: IOFunctions,
    layerService: LayerService,
    renderingManager: RenderingManager,
    stateManager: StateManager
  ): UIManager {
    if (!this.#instance) {
      console.debug(`No UIManager instance exists yet. Creating new instance.`);
      this.#instance = new UIManager(
        cache,
        core,
        errorHandler,
        ioFns,
        layerService,
        renderingManager,
        stateManager
      );
    }

    console.debug(`Returning UIManager instance.`);
    return this.#instance;
  }

  initialize(): void {
    this.#setupAddImgButton();
    this.#setupBrowserToggleBtn();
    this.#setupClearBtn();
    this.#setupDownloadBtn();
    this.#setupTextInputForm();
    this.#setupSetBackgroundButton();
    this.#setupDragText();
  }

  #setupAddImgButton(): void {
    const btn = this.#getElement(this.#ids.addImgBtn) as HTMLButtonElement;
    const input = this.#getElement(this.#ids.addImgInput) as HTMLInputElement;

    btn.addEventListener('click', () => {
      this.#stateManager.setUIState('uploadMode', 'image');
      input.value = '';
      input.click();
    });

    input.addEventListener('change', async (_e: Event) => {
      const file = input.files?.[0];
      if (!file) return;
      const reader = new FileReader();

      reader.onload = async () => {
        const layer = await this.#layerService.createImageLayer(
          reader.result as string,
          file
        );
        this.#stateManager.addLayer(layer);
      };

      reader.readAsDataURL(file);
    });
  }

  #setupBrowserToggleBtn(): void {
    const btn = this.#getElement(
      this.#ids.toggleAssetBrowserBtn
    ) as HTMLButtonElement;
    const browser = this.#getElement(
      this.#ids.assetBrowserDiv
    ) as HTMLDivElement;

    btn.addEventListener('click', () => {
      browser.classList.toggle('open');
    });

    document.addEventListener('click', (e: MouseEvent) => {
      if (!browser.contains(e.target as Node) && e.target !== btn) {
        browser.classList.remove('open');
      }
    });
  }

  #setupClearBtn(): void {
    return this.#syncErrorHandler(() => {
      const btn = this.#getElement(this.#ids.clearBtn) as HTMLButtonElement;

      btn.addEventListener('click', () => {
        // 1. remove all text elements
        this.#stateManager.clearCanvasAll();

        // 2. remove background image from state
        this.#stateManager.setCanvasImage(undefined, this.#renderingManager);
        this.#stateManager.setCanvasAspectRatio(undefined);

        // 3. clear animations
        this.#stateManager.clearCanvasAnimation();

        // 4. clear cached background image
        this.#cache.cachedBgImg = null;
        this.#stateManager.clearCanvasAll();

        console.info(`Canvas cleared and reset via StateManager.`);
      });

      console.debug(`Clear Button listener successfully attached.`);
    }, 'Unhandled Canvas Clear Button initialization error.');
  }

  #setupDownloadBtn(): void {
    return this.#syncErrorHandler(() => {
      const btn = this.#getElement(this.#ids.downloadBtn) as HTMLButtonElement;

      btn.addEventListener('click', () => {
        const canvas = this.#getElement(this.#ids.canvas) as HTMLCanvasElement;
        const state = this.#stateManager.getCanvas();
        const hasAnimatedLayer = state.layers.some(
          layer =>
            layer.kind === 'image' &&
            (layer.element as LayerElement).kind === 'animated_image'
        );
        const width = canvas.width;
        const height = canvas.height;
        const frameCount = this.#defaults.animation.frameCount;
        const fileName = this.#defaults.fileName || 'default.png';

        if (hasAnimatedLayer) {
          console.debug(
            `AnimationLayer(s) detected - running GIF export pipeline...`
          );
          this.#ioFns.exportGif(
            state.layers,
            width,
            height,
            frameCount,
            this.#core,
            this.#renderingManager,
            fileName
          );
        } else {
          console.debug(`Running static image export pipeline...`);
          this.#ioFns.exportStaticFile(
            state.layers,
            width,
            height,
            this.#core,
            this.#renderingManager,
            fileName
          );
        }
      });

      console.debug(`Download Button listener successfully attached.`);
    }, 'Unhandled Download Button initialization error.');
  }

  #setupSetBackgroundButton(): void {
    const btn = this.#getElement(
      this.#ids.setBackgroundBtn
    ) as HTMLButtonElement;
    const input = this.#getElement(
      this.#ids.setBackgroundInput
    ) as HTMLInputElement;

    btn.addEventListener('click', () => {
      this.#stateManager.setUIState('uploadMode', 'background');
      input.click();
    });

    input.addEventListener('change', (_e: Event) => {
      const file = input.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        this.#stateManager.setCanvasImage(
          reader.result as string,
          this.#renderingManager
        );
      };
      reader.readAsDataURL(file);
    });
  }

  #setupDragText(): void {
    let dragging = false;
    let isResizing = false;
    let dragTarget: { layerIndex: number } | null = null;
    let resizeTarget: { layerIndex: number } | null = null;
    let dragOffset = { x: 0, y: 0 };
    let initialMouseY = 0;
    let initialFontSize = 32;

    return this.#syncErrorHandler(() => {
      const canvas = this.#getElement(this.#ids.canvas) as HTMLCanvasElement;

      canvas.addEventListener('mousedown', e => {
        dragging = false;
        isResizing = false;
        dragTarget = null;
        resizeTarget = null;

        const state = this.#stateManager.getCanvas();
        const mouse = this.#renderingManager.getMousePositionFromEvent(
          canvas,
          e
        );
        const textElems = this.#renderingManager.getTextElements();

        for (let i = textElems.length - 1; i >= 0; i--) {
          const { elem, layerIndex } = textElems[i];

          if (this.#renderingManager.isOverTextResizeHandle(mouse, elem)) {
            isResizing = true;
            resizeTarget = { layerIndex };
            initialMouseY = mouse.y;
            initialFontSize = elem.fontSize ?? 32;
            this.#stateManager.setSelectedLayerIndex(layerIndex);
            return;
          }

          if (this.#renderingManager.isPointInTextElement(mouse, elem)) {
            dragging = true;
            dragTarget = { layerIndex };
            dragOffset = {
              x: mouse.x - elem.position.x,
              y: mouse.y - elem.position.y
            };
            this.#stateManager.setSelectedLayerIndex(layerIndex);
            return;
          }
        }

        for (let i = state.layers.length - 1; i >= 0; i--) {
          const layer = state.layers[i];
          if (
            this.#typeguards.isImageLayer(layer) &&
            (layer.element.kind === 'static_image' ||
              layer.element.kind === 'animated_image')
          ) {
            const elem = layer.element;
            const img = elem.element;
            if (!img) continue;

            const x = elem.position.x;
            const y = elem.position.y;
            const w = img.width * elem.scale.x;
            const h = img.height * elem.scale.y;

            if (
              mouse.x >= x &&
              mouse.x <= x + w &&
              mouse.y >= y &&
              mouse.y <= y + h
            ) {
              dragging = true;
              dragTarget = { layerIndex: i };
              dragOffset = { x: mouse.x - x, y: mouse.y - y };
              this.#stateManager.setSelectedLayerIndex(i);
              return;
            }
          }
        }
      });

      canvas.addEventListener('mousemove', e => {
        const state = this.#stateManager.getCanvas();
        const mouse = this.#renderingManager.getMousePositionFromEvent(
          canvas,
          e
        );

        if (isResizing && resizeTarget) {
          const { layerIndex } = resizeTarget;
          const layer = state.layers[layerIndex];
          if (!this.#typeguards.isImageLayer(layer)) return;

          const elem = layer.element;

          if (elem.kind === 'text') {
            const deltaY = mouse.y - initialMouseY;
            const newFontSize = Math.max(10, initialFontSize + deltaY);
            elem.fontSize = newFontSize;
            this.#renderingManager.requestRedraw();
            return;
          }

          if (elem.kind === 'static_image' && elem.element) {
            const img = elem.element;
            const newScaleX = Math.max(
              (mouse.x - elem.position.x) / img.width,
              0.1
            );
            const newScaleY = Math.max(
              (mouse.y - elem.position.y) / img.height,
              0.1
            );
            elem.scale = { x: newScaleX, y: newScaleY };
            this.#renderingManager.requestRedraw();
          }

          return;
        }

        if (dragging && dragTarget) {
          const { layerIndex } = dragTarget;
          const layer = state.layers[layerIndex];
          if (!this.#typeguards.isImageLayer(layer)) return;

          const elem = layer.element;
          elem.position = {
            x: mouse.x - dragOffset.x,
            y: mouse.y - dragOffset.y
          };

          this.#renderingManager.requestRedraw();
        }
      });

      canvas.addEventListener('mouseup', () => {
        dragging = false;
        isResizing = false;
        dragTarget = null;
        resizeTarget = null;
      });

      canvas.addEventListener('mouseleave', () => {
        dragging = false;
        isResizing = false;
        dragTarget = null;
        resizeTarget = null;
      });

      canvas.addEventListener('dblclick', e => {
        const mouse = this.#renderingManager.getMousePositionFromEvent(
          canvas,
          e
        );
        const textElems = this.#renderingManager.getTextElements();

        for (let i = textElems.length - 1; i >= 0; i--) {
          const { elem, elemIndex } = textElems[i];

          if (this.#renderingManager.isPointInTextElement(mouse, elem)) {
            this.#renderingManager.showTextOverlay(
              canvas,
              elem,
              elemIndex,
              () => this.#renderingManager.requestRedraw()
            );
            break;
          }
        }
      });
    }, 'Unhandled text drag handlers initialization error.');
  }

  #setupTextInputForm(): void {
    return this.#syncErrorHandler(() => {
      const textForm = this.#getElement(this.#ids.textForm) as HTMLFormElement;
      const textInput = this.#getElement(
        this.#ids.textInput
      ) as HTMLInputElement;
      const canvas = this.#getElement(this.#ids.canvas) as HTMLCanvasElement;

      textForm.addEventListener('submit', (e: Event) => {
        e.preventDefault();

        const text = textInput.value.trim();
        if (!text) return;
        const position = { x: canvas.width / 2, y: canvas.height / 2 };

        this.#stateManager.addTextElement({
          kind: 'text',
          id: crypto.randomUUID(),
          asset: this.#assets.dummyTextAsset,
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
}
