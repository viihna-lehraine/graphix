// File: frontend/src/app/core/data/dom/ids.ts

import type {
  DomBtnIds,
  DomDivIds,
  DomFormIds,
  DomIds,
  DomInputIds
} from '../../meta/index.js';

const addImgBtn = 'add-img-btn';
const addImgInput = 'add-img-input';
const assetBrowserDiv = 'asset-browser';
const canvas = 'main-canvas';
const canvasContainerDiv = 'canvas-container';
const canvasToolbarDiv = 'canvas-toolbar';
const clearBtn = 'clear-btn';
const downloadBtn = 'download-btn';
const setBackgroundBtn = 'set-background-btn';
const setBackgroundInput = 'set-background-input';
const textInput = 'text-input';
const textForm = 'text-form';
const toggleAssetBrowserBtn = 'toggle-asset-browser-btn';

const btns: DomBtnIds = {
  addImgBtn,
  clearBtn,
  downloadBtn,
  setBackgroundBtn,
  toggleAssetBrowserBtn
} as const;

const divs: DomDivIds = {
  assetBrowserDiv,
  canvasContainerDiv: canvasContainerDiv,
  canvasToolbarDiv: canvasToolbarDiv
} as const;

const forms: DomFormIds = {
  textForm
} as const;

const inputs: DomInputIds = {
  addImgInput,
  setBackgroundInput,
  textInput
} as const;

export const domIDs: DomIds = {
  canvas,
  ...btns,
  ...divs,
  ...forms,
  ...inputs
} as const;
