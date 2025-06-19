// File: frontend/src/app/core/data/dom.ts

import type {
  DomBtnIds,
  DomDivIds,
  DomClasses,
  DomData,
  DomFormIds,
  DomIds,
  DomInputIds
} from '../types/index.js';

// ================================================== //

const assetThumb = 'asset-thumbnail';
const fontSelector = 'font-selector';
const textEditOverlay = 'text-edit-overlay';
const textColorPicker = 'text-color-picker';
const textSizeInput = 'text-size-input';

const classes: DomClasses = {
  assetThumb,
  fontSelector,
  textColorPicker,
  textEditOverlay,
  textSizeInput
} as const;

// ================================================== //

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

const domIDs: DomIds = {
  canvas,
  ...btns,
  ...divs,
  ...forms,
  ...inputs
} as const;

// ================================================== //

export const domData: DomData = {
  classes,
  ids: domIDs
} as const;
