// File: frontend/src/app/features/engine/io.ts

import type {
  Asset,
  BlendMode,
  Core,
  GifAnimation,
  Layer,
  IOFunctions
} from '../../types/index.js';
import GIF from 'gif.js';
import html2canvas from 'html2canvas';

async function exportGif(
  layers: Layer[],
  width: number,
  height: number,
  frameCount: number = 60,
  core: Core,
  fileName?: string
): Promise<void> {
  const {
    data: {
      config: { defaults, paths }
    }
  } = core;
  if (!fileName) fileName = defaults.fileName + '.gif';

  return new Promise((resolve, reject) => {
    const gif = new GIF({
      workers: 2,
      quality: 10,
      width,
      height,
      workerScript: paths.gifWorkerScript
    });

    const offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = width;
    offscreenCanvas.height = height;

    const offCtx = offscreenCanvas.getContext('2d');
    if (!offCtx) {
      reject(new Error('Offscreen canvas 2D context unavailable'));
      return;
    }

    const baseFrameDelay = 100; // ms/frame

    for (let frameIndex = 0; frameIndex < frameCount; frameIndex++) {
      // step GIF layers to this frame
      for (const layer of layers) {
        for (const elem of layer.elements) {
          if (elem.kind === 'animated_image') {
            elem.currentFrame = frameIndex % elem.gifFrames.length;
          }
        }
      }

      // draw this frame
      offCtx.clearRect(0, 0, width, height);
      // drawVisualLayersToContext(offCtx, layers);

      // add frame to GIF
      gif.addFrame(offCtx, { copy: true, delay: baseFrameDelay });
    }

    gif.on('finished', (blob: Blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
      resolve();
    });

    // eslint-disable-next-line
    (gif as any).on('error', (error: unknown) => {
      reject(error);
    });

    gif.render();
  });
}

async function exportStaticFile(
  layers: Layer[],
  width: number,
  height: number,
  core: Core,
  fileName?: string
): Promise<void> {
  const {
    data: {
      config: { defaults }
    },
    services: { errors },
    utils
  } = core;
  if (!fileName) fileName = defaults.fileName + '.png';

  return errors.handleAsync(async () => {
    const offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = width;
    offscreenCanvas.height = height;

    const offCtx = offscreenCanvas.getContext('2d');
    if (!offCtx) throw new Error('Offscreen canvas 2D context unavailable');

    offCtx.clearRect(0, 0, width, height);

    // draw all layers
    utils.canvas.drawVisualLayersToContext(offCtx, layers);

    // export as PNG
    offscreenCanvas.toBlob(blob => {
      if (!blob) throw new Error('Failed to generate PNG blob');

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
  }, 'Static file export failed.');
}

async function handleDownload(
  targetRef: { current: HTMLDivElement | null } | null,
  core: Core,
  fileName?: string
): Promise<void> {
  const {
    data: {
      config: { defaults }
    },
    services: { errors, log }
  } = core;
  if (!fileName) fileName = defaults.fileName;

  return errors.handleAsync(async () => {
    if (!targetRef || !targetRef.current) {
      log.error('Target reference is null or undefined.', 'handleDownload');
      return;
    }

    const canvas = await html2canvas(targetRef.current, {
      backgroundColor: null
    });
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
  }, 'File download failed.');
}

async function handleUpload(
  file: File,
  core: Core,
  createGifAnimation: (arrayBuffer: ArrayBuffer) => GifAnimation
): Promise<void> {
  const {
    data: {
      dom: { ids }
    },
    helpers,
    services: { cache, errors, stateManager }
  } = core;

  return errors.handleAsync(async () => {
    const fileName = file.name;
    const ext = fileName.split('.').pop()?.toLowerCase() ?? '';

    const canvas = document.getElementById(
      ids.canvas
    ) as HTMLCanvasElement | null;
    if (!canvas) throw new Error(`Canvas element not found.`);

    const ctx = helpers.canvas.get2DContext(canvas);

    // GIF support
    if (ext === 'gif') {
      const arrayBuffer = await file.arrayBuffer();
      const anim = createGifAnimation(arrayBuffer);

      stateManager.setCanvasAnimation(anim);

      anim.play(ctx);

      // don't run static image logic!
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        const imgAspect = img.width / img.height;
        const imageDataUrl = e.target?.result as string;

        stateManager.setCanvasImage(imageDataUrl);
        stateManager.setCanvasAspectRatio(imgAspect);

        cache.cachedBgImg = img;

        canvas.style.width = 'auto';
        canvas.style.height = 'auto';

        const canvasAspect = canvas.width / canvas.height;
        let drawWidth, drawHeight, offsetX, offsetY;
        if (imgAspect > canvasAspect) {
          drawWidth = canvas.width;
          drawHeight = canvas.width / imgAspect;
          offsetX = 0;
          offsetY = (canvas.height - drawHeight) / 2;
        } else {
          drawHeight = canvas.height;
          drawWidth = canvas.height * imgAspect;
          offsetY = 0;
          offsetX = (canvas.width - drawWidth) / 2;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;

        // get current number of image layers
        const layers = stateManager.getCanvas().layers;
        const imageLayerCount = layers.filter(l =>
          l.elements.some(e => e.kind === 'static_image')
        ).length;

        const asset: Asset = {
          type: 'image',
          name: fileName,
          class: 'static',
          src: img.src,
          ext: ext,
          tags: [],
          size_kb: file.size / 1024,
          hash_sha256: '',
          credits: false,
          license: false,
          tileable: false,
          width: img.width,
          height: img.height,
          font: false,
          animation: false
        } as const;

        const imageElement = {
          kind: 'static_image',
          id: crypto.randomUUID(),
          asset,
          position: {
            x: canvasWidth / 2 + 20 * imageLayerCount,
            y: canvasHeight / 2 - 20 * imageLayerCount
          },
          scale: { x: 1, y: 1 },
          rotation: 0,
          element: img
        } as const;

        const imageLayer: Layer = {
          id: crypto.randomUUID(),
          name: 'Image Layer',
          opacity: 1,
          visible: true,
          zIndex: layers.length,
          blendMode: 'normal' as BlendMode,
          elements: [imageElement]
        } as const;

        stateManager.addLayer(imageLayer);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);

    console.log(`Current layers:`, stateManager.getCanvas().layers);
  }, 'File upload processing failed.');
}

// =================================================== //

export const io: IOFunctions = {
  exportGif,
  exportStaticFile,
  handleDownload,
  handleUpload
} as const;
