// File: frontend/src/app/sys/bootstrap/main.ts

import type { Core } from '../../meta/index.js';

export async function bootstrap(core: Core): Promise<void> {
  const { errors } = core.services;

  return errors.handleAsync(async () => {
    console.debug(`Executing main bootstrap function`);

    console.debug(`Importing setGlobalErrorHandlers function`);
    const { setGlobalErrorHandlers } = await import('./partials.js');
    console.debug(`Successfully imported setGlobalErrorHandlers function`);

    console.debug(`Executing setGlobalErrorHandlers function`);
    await setGlobalErrorHandlers();
    console.debug(`setGlobalErrorHandlers function execution complete.`);
  }, `Main bootstrap process failed.`);
}
