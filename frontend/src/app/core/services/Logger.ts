// File: frontend/src/app/core/services/LoggerService.ts

import { Helpers, LoggerServiceContract } from '../../types/index.js';

// ================================================== //
// ================================================== //

export class Logger implements LoggerServiceContract {
  static #instance: Logger | null = null;

  private constructor(helpers: Helpers) {
    try {
      helpers.app.noop();
    } catch (error) {
      throw new Error(`constructor]: ${error instanceof Error ? error.message : error}`);
    }
  }

  static getInstance(helpers: Helpers): Logger {
    try {
      if (!Logger.#instance) {
        Logger.#instance = new Logger(helpers);

        console.log(`No existing Logger instance found. Creating new instance.`);
      }

      console.log(`Returning Logger instance.`);

      return Logger.#instance;
    } catch (error) {
      throw new Error(`${error instanceof Error ? error.message : error}`);
    }
  }

  debug(message: string, caller?: string): void {
    this.#logMessage(message, 'debug', caller);
  }

  error(message: string, caller?: string): void {
    this.#logMessage(message, 'error', caller);
  }

  info(message: string, caller?: string): void {
    this.#logMessage(message, 'info', caller);
  }

  warn(message: string, caller?: string): void {
    this.#logMessage(message, 'warn', caller);
  }

  #getFormattedTimestamp(): string {
    return new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  }

  #getLevelColor(level: 'debug' | 'info' | 'warn' | 'error'): string {
    switch (level) {
      case 'debug':
        return 'color: green';
      case 'info':
        return 'color: blue';
      case 'warn':
        return 'color: orange';
      case 'error':
        return 'color: red';
      default:
        return 'color: black';
    }
  }

  #logMessage(message: string, level: 'debug' | 'info' | 'warn' | 'error', caller?: string): void {
    const callerInfo = caller;
    const timestamp = this.#getFormattedTimestamp();

    try {
      console.log(
        `%c[${level.toUpperCase()}]%c ${timestamp} [${callerInfo}] %c${message}`,
        this.#getLevelColor(level),
        'color: gray',
        'color: inherit'
      );
    } catch (error) {
      console.error(`[${caller}.#logMessage]: Encountered an unexpected error: ${error}.`);
    }

    if (callerInfo === 'Unknown caller') {
      console.trace(`[${caller}]: Full Stack Trace:`);
    }
  }
}
