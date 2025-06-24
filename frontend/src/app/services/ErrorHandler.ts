// File: frontend/src/app/services/ErrorHandler.ts

import type {
  Data,
  Defaults,
  ErrorClasses,
  ErrorHandlerServiceContract,
  ErrorHandlerOptions,
  Typeguards,
  Utilities
} from '@index';
import { error_classes } from '@index';

export class ErrorHandler implements ErrorHandlerServiceContract {
  static #instance: ErrorHandler | null = null;

  #defaults: Defaults;
  #error_classes: ErrorClasses = error_classes;
  #typeguards: Typeguards;

  private constructor(data: Data, utils: Utilities) {
    try {
      console.debug(`Creating ErrorHandler instance.`);

      this.#defaults = data.defaults;
      this.#typeguards = utils.typeguards;
    } catch (error) {
      throw new Error(
        `Unable to create ErrorHandler instance: ${error instanceof Error ? error.message : error}`
      );
    }
  }

  static getInstance(data: Data, utils: Utilities): ErrorHandler {
    try {
      if (!ErrorHandler.#instance) {
        console.debug(
          `No ErrorHandler instance exists yet. Creating new instance.`
        );
        ErrorHandler.#instance = new ErrorHandler(data, utils);
      }

      console.debug(`Returning ErrorHandler instance.`);

      return ErrorHandler.#instance;
    } catch (error) {
      throw new Error(`${error instanceof Error ? error.message : error}`);
    }
  }

  auto<T>(fn: () => T | Promise<T>): T | Promise<T> {
    return this.handleAndReturn(fn, 'Auto-handled error');
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
    const { retry } = options;

    const attempts =
      typeof retry === 'object' && retry.attempts != null
        ? retry.attempts
        : this.#defaults.retryAttempts;

    const delayMs =
      typeof retry === 'object' && retry.delayMs != null
        ? retry.delayMs
        : this.#defaults.retryDelayMs;

    const useRetry = typeof retry === 'object';

    if (useRetry) {
      let lastError: unknown;

      for (let attempt = 1; attempt <= attempts; attempt++) {
        try {
          return await action();
        } catch (error) {
          lastError = error;
          retry?.onError?.(error, attempt);

          if (attempt < attempts) {
            await new Promise(resolve => setTimeout(resolve, delayMs));
          }
        }
      }

      this.#handle(lastError, errorMessage, options);
      throw lastError;
    }

    try {
      return await action();
    } catch (error) {
      this.#handle(error, errorMessage, options);
      throw error;
    }
  }

  handleSync<T>(
    action: () => T,
    errorMessage: string,
    options: ErrorHandlerOptions = {}
  ): T {
    try {
      return action();
    } catch (error) {
      this.#handle(error, errorMessage, options);

      throw error;
    }
  }

  #formatError(
    error: unknown,
    message: string,
    context: Record<string, unknown>
  ): string {
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

  #handle(
    error: unknown,
    errorMessage: string,
    options: ErrorHandlerOptions = {}
  ): void {
    const context: Record<string, unknown> =
      typeof options.context === 'object' && options.context !== null
        ? options.context
        : {};
    const formattedError = this.#formatError(error, errorMessage, context);
    const suppressConsole =
      options.suppressConsole ?? this.#defaults.suppressConsole;
    const suppressAlert = options.suppressAlert ?? this.#defaults.suppressAlert;
    const isSystem = this.#typeguards.isSystemError(error);
    const isUser = this.#typeguards.isUserFacingError(error);

    if (!suppressConsole) {
      if (isSystem && error instanceof Error) {
        console.groupCollapsed(`[SYSTEM ERROR] ${error.name}`);
        console.error(formattedError);

        const ctx = (error as { context?: Record<string, unknown> }).context;
        if (ctx && typeof ctx === 'object') {
          console.table(ctx);
        }

        console.groupEnd();
      } else {
        console.error(formattedError);
      }
    }

    const userMessage =
      options.userMessage ?? (isUser ? error.userMessage : undefined);

    if (userMessage && !suppressAlert) {
      alert(userMessage);
    }
  }
}
