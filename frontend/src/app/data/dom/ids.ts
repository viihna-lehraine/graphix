// File: frontend/src/app/data/dom/ids.ts

import type { DomIds } from '../../types/index.js';

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

const btns: DomIds['btns'] = {
  clear: clearBtn,
  download: downloadBtn,
  upload: uploadBtn
} as const;

const divs: DomIds['divs'] = {
  canvasContainer,
  canvasToolbar
} as const;

const forms: DomIds['forms'] = {
  text: textInputForm
} as const;

const inputs: DomIds['inputs'] = {
  imgUpload: imgUploadInput,
  text: textInput
} as const;

// ================================================== //

export const domIDs: DomIds = {
  btns,
  canvas,
  divs,
  forms,
  inputs
} as const;
