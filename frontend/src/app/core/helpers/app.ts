// File: frontend/src/app/core/helpers/app.ts

import { Helpers } from '../../types/index.js';

export const appHelpersFactory = (): Helpers['app'] => ({
  noop(): void {}
});
