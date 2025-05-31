// File: frontend/src/app/data/dom/ids.ts

import type { DOM_IDs } from '../../types/index.js';

// ================================================== //
// ================================================== //

const clearBtn = 'clear-btn';
const downloadBtn = 'download-btn';
const uploadBtn = 'upload-btn';

const canvas = 'main-canvas';
const canvasContainer = 'canvas-container';

const canvasToolbar = 'canvas-toolbar';

const textInputForm = 'text-form';

const imgUploadInput = 'img-upload-input';
const textInput = 'text-input';

// ================================================== //

const btns: DOM_IDs['btns'] = {
  clear: clearBtn,
  download: downloadBtn,
  upload: uploadBtn
} as const;

// ================================================== //

const divs: DOM_IDs['divs'] = {
  canvasContainer,
  canvasToolbar
} as const;

// ================================================== //

const forms: DOM_IDs['forms'] = {
  text: textInputForm
} as const;

// ================================================== //

const inputs: DOM_IDs['inputs'] = {
  imgUpload: imgUploadInput,
  text: textInput
} as const;

// ================================================== //
// ================================================== //

export const domIDs: DOM_IDs = {
  btns,
  canvas,
  divs,
  forms,
  inputs
} as const;
