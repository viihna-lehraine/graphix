// File: frontend/src/app/core/services/Notifier.ts

import type {
  NotifierLevel,
  NotifierServiceContract
} from '../../types/index.js';

// =================================================== //
// =================================================== //

export class Notifier implements NotifierServiceContract {
  static #instance: Notifier | null = null;

  private constructor() {}

  static getInstance(): Notifier {
    if (!Notifier.#instance) {
      Notifier.#instance = new Notifier();
    }
    return Notifier.#instance;
  }

  // ================================================== //

  notify(message: string, level: NotifierLevel = 'warn'): void {
    switch (level) {
      case 'info':
        alert(`ℹ️ ${message}`);
        break;
      case 'warn':
        alert(`⚠️ ${message}`);
        break;
      case 'error':
        alert(`❌ ${message}`);
        break;
      case 'success':
        alert(`✅ ${message}`);
        break;
    }
  }

  // ================================================== //

  info(message: string): void {
    this.notify(message, 'info');
  }
  warn(message: string): void {
    this.notify(message, 'warn');
  }
  error(message: string): void {
    this.notify(message, 'error');
  }
  success(message: string): void {
    this.notify(message, 'success');
  }
}
