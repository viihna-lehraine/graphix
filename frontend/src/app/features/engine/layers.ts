// File: frontend/src/app/features/engine/layers.ts

import {
  GifAsset,
  GifVisualLayer,
  ImageAsset,
  ImageVisualLayer,
  OverlayAsset,
  OverlayVisualLayer,
  StickerAsset,
  StickerVisualLayer,
  TextElement,
  TextVisualLayer
} from '../../types/index.js';

// ====================================================== //

function makeGifLayer(asset: GifAsset, zIndex: number): GifVisualLayer {
  return {
    id: crypto.randomUUID(),
    type: 'gif',
    assetRef: asset,
    opacity: 1,
    visible: true,
    zIndex,
    gifFrames: [],
    currentFrame: 0,
    frameElapsed: 0
  };
}

function makeImageLayer(asset: ImageAsset, zIndex: number): ImageVisualLayer {
  return {
    id: crypto.randomUUID(),
    type: 'image',
    assetRef: asset,
    opacity: 1,
    visible: true,
    zIndex,
    element: new Image()
  };
}

function makeOverlayLayer(
  asset: OverlayAsset,
  zIndex: number
): OverlayVisualLayer {
  return {
    id: crypto.randomUUID(),
    type: 'overlay',
    assetRef: asset,
    opacity: 1,
    visible: true,
    zIndex,
    blendMode: asset.blendMode,
    element: new Image()
  };
}

function makeStickerLayer(
  asset: StickerAsset,
  zIndex: number
): StickerVisualLayer {
  return {
    id: crypto.randomUUID(),
    type: 'sticker',
    assetRef: asset,
    opacity: 1,
    visible: true,
    zIndex,
    element: new Image()
  };
}

function makeTextLayer(
  zIndex: number,
  elements: TextElement[]
): TextVisualLayer {
  return {
    id: crypto.randomUUID(),
    type: 'text',
    assetRef: null,
    opacity: 1,
    visible: true,
    zIndex,
    textElements: elements
  };
}

// ====================================================== //

export const createLayer = {
  gif: makeGifLayer,
  image: makeImageLayer,
  overlay: makeOverlayLayer,
  sticker: makeStickerLayer,
  text: makeTextLayer
} as const;
