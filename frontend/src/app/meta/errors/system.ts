// File: frontend/src/app/meta/error/system.ts

import { error_messages as msgs } from '../../config/error_messages.js';

export class SystemError extends Error {
  constructor(
    message: string,
    public context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'SystemError';
  }
}

// ========================================================== //

export class AppStartupError extends SystemError {
  constructor(detail: string, userMessage = msgs.appStartupError) {
    super(`Application startup failed: ${userMessage}`, { detail });
  }
}

export class BuildError extends SystemError {
  constructor(detail: string) {
    super(`Failed to execute application build process: ${detail}`, { detail });
    this.name = 'BuildError';
  }
}

export class CorruptManifestError extends SystemError {
  constructor(details: string) {
    super(`${msgs.corruptManifest}: ${details}`);
  }
}

// ========================================================== //
// ========================================================== //

export const system_error_classes = {
  SystemError,
  AppStartupError,
  BuildError,
  CorruptManifestError
} as const;
