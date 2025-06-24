// File: frontend/src/app/config/errors_messages.ts

import type { ErrorMessages } from '@index';

const post_message = 'If the problem persists, please contact support.';

// ================================================================ //

const assetLoadError = `One or more assets failed to load. Please refresh the page and try again. ${post_message}`;

const buildError = `A build error has occurred. Please check the console for details.`;

const canvasUnsupported =
  'Your browser does not support required canvas features.';

const corruptManifest = `The asset manifest is corrupt or invalid. Please refresh the page and try again. ${post_message}`;

const appStartupError = 'An error occurred during application startup';

const networkIssue =
  'A network issue has occurred and the connection was lost. Please check your connection and try again.';

const renderFailure = `An error occurred while rendering the content. Please refresh the page and try again. ${post_message}.`;

const unknownFatalError =
  'An unknown fatal error has occurred. Please refresh the page and try again. If the problem persists, please contact support.';

export const error_messages: ErrorMessages = {
  appStartupError,
  assetLoadError,
  buildError,
  canvasUnsupported,
  corruptManifest,
  networkIssue,
  renderFailure,
  unknownFatalError
} as const;
