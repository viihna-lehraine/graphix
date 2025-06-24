// File: frontend/src/app/meta/error/user_facing.ts

import { error_messages as msgs } from '@config/error_messages.js';

export class UserFacingError extends Error {
  constructor(
    message: string,
    public userMessage?: string
  ) {
    super(message);
    this.name = 'UserFacingError';
  }
}

// ========================================================== //

export class AssetLoadError extends UserFacingError {
  constructor(details: string, userMessage = msgs.assetLoadError) {
    super(`Asset failed to load: ${details}`, userMessage);
  }
}

export class NetworkError extends UserFacingError {
  constructor(detail: string, userMessage = msgs.networkIssue) {
    super(`Network error: ${detail}`, userMessage);
  }
}

export class RenderFailureError extends UserFacingError {
  constructor(reason: string, userMessage = msgs.renderFailure) {
    super(`Render failure: ${reason}`, userMessage);
  }
}

export class UnknownFatalError extends UserFacingError {
  constructor(detail: string, userMessage = msgs.unknownFatalError) {
    super(`Unknown error occurred: ${detail}`, userMessage);
  }
}

// ========================================================== //
// ========================================================== //

export const user_facing_error_classes = {
  UserFacingError,
  AssetLoadError,
  NetworkError,
  RenderFailureError,
  UnknownFatalError
} as const;
