// File: frontend/src/app/meta/types/errors.ts

import { error_classes } from '@meta/errors/index.js';

export type SystemErrorInstance = InstanceType<
  typeof error_classes.SystemError
>;

export type UserFacingErrorInstance = InstanceType<
  typeof error_classes.UserFacingError
>;

// ========================================================== //

export type AppStartupErrorInstance = InstanceType<
  typeof error_classes.AppStartupError
>;

export type AssetLoadErrorInstance = InstanceType<
  typeof error_classes.AssetLoadError
>;

export type BuildErrorInstance = InstanceType<typeof error_classes.BuildError>;

export type CorruptManifestErrorInstance = InstanceType<
  typeof error_classes.CorruptManifestError
>;

export type NetworkErrorInstance = InstanceType<
  typeof error_classes.NetworkError
>;

export type RenderFailureErrorInstance = InstanceType<
  typeof error_classes.RenderFailureError
>;

export type UnknownFatalErrorInstance = InstanceType<
  typeof error_classes.UnknownFatalError
>;

export type ErrorClasses = typeof error_classes;
