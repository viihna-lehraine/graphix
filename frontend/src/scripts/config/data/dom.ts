// File: frontend/src/scripts/config/data/dom.ts

import { DOMData } from '../../types/index.js';

// ================================================= //
// ================================================= //

const canvas = document.getElementById('memory-canvas') as HTMLCanvasElement;
const counter = document.getElementById('memory-counter') as HTMLSpanElement;
const form = document.getElementById('memory-form') as HTMLFormElement;
const input = document.getElementById('memory-input') as HTMLInputElement;
const list = document.getElementById('memory-list') as HTMLUListElement;

// ================================================= //
// ================================================= //

export const domData: DOMData = {
  canvas,
  counter,
  form,
  input,
  list
} as const;
