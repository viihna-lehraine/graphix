// File: frontend/src/app/utils/typeguards.ts

import type {
  Layer,
  ImageLayer,
  SystemErrorInstance,
  Typeguards,
  UserFacingErrorInstance
} from '../meta/index.js';
import { SystemError, UserFacingError } from '../meta/index.js';

export const typeguardFactory = (): Typeguards =>
  ({
    isImageLayer(layer: Layer): layer is ImageLayer {
      return layer.kind === 'image';
    },

    isSystemError(error: unknown): error is SystemErrorInstance {
      return error instanceof SystemError;
    },

    isUserFacingError(error: unknown): error is UserFacingErrorInstance {
      return error instanceof UserFacingError;
    }
  }) as const;
