// File: frontend/src/scripts/core/services/ErrorHandler.ts

import { ErrorHandlerServiceContract, ErrorHandlerOptions } from '../../types/index.js';
import { errorClasses, ErrorClasses } from './errorClasses.js';
import { Logger } from './Logger.js';

// ================================================== //
// ================================================== //

export class ErrorHandler implements ErrorHandlerServiceContract {
  static #instance: ErrorHandler | null = null;
  #errorClasses: ErrorClasses = errorClasses;
  #logger: Logger;

  private constructor(logger: Logger) {
    try {
      this.#logger = logger;
    } catch (error) {
      throw new Error(`${error instanceof Error ? error.message : error}`);
    }
  }

  static getInstance(logger: Logger): ErrorHandler {
    try {
      if (!ErrorHandler.#instance) {
        console.debug(`No ErrorHandler instance exists yet. Creating new instance.`);
        ErrorHandler.#instance = new ErrorHandler(logger);
      }

      console.debug(`Returning ErrorHandler instance.`);

      return ErrorHandler.#instance;
    } catch (error) {
      throw new Error(`${error instanceof Error ? error.message : error}`);
    }
  }

  handleAndReturn<T>(
    action: () => T | Promise<T>,
    errorMessage: string,
    options: ErrorHandlerOptions = {}
  ): T | Promise<T> {
    try {
      const result = action();

      if (result instanceof Promise) {
        return result.catch(error => {
          this.#handle(error, errorMessage, options);

          return (options.fallback as T) ?? Promise.reject(error);
        });
      }

      return result;
    } catch (error) {
      this.#handle(error, errorMessage, options);

      return options.fallback as T;
    }
  }

  async handleAsync<T>(
    action: () => Promise<T>,
    errorMessage: string,
    options: ErrorHandlerOptions = {}
  ): Promise<T> {
    try {
      return await action();
    } catch (error) {
      this.#handle(error, errorMessage, options);

      throw error;
    }
  }

  handleSync<T>(action: () => T, errorMessage: string, options: ErrorHandlerOptions = {}): T {
    try {
      return action();
    } catch (error) {
      this.#handle(error, errorMessage, options);

      throw error;
    }
  }

  #formatError(error: unknown, message: string, context: Record<string, unknown>): string {
    try {
      return error instanceof Error
        ? `${message}: ${error.message}. Context: ${JSON.stringify(context)}`
        : `${message}: ${error}. Context: ${JSON.stringify(context)}`;
    } catch (error) {
      throw new Error(
        `[Error formatting error message: ${error instanceof Error ? error.message : error}`
      );
    }
  }

  #handle(error: unknown, errorMessage: string, options: ErrorHandlerOptions = {}): void {
    try {
      const formattedError = this.#formatError(error, errorMessage, options.context ?? {});

      this.#logger.error(formattedError);

      const userMessage =
        options.userMessage ??
        (error instanceof this.#errorClasses.UserFacingError ? error.userMessage : undefined);

      if (userMessage) {
        alert(userMessage);
      }
    } catch (error) {
      throw new Error(`Error handling error: ${error instanceof Error ? error.message : error}`);
    }
  }
}
