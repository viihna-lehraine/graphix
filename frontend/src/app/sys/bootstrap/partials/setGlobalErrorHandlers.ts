// File: frontend/src/app/sys/bootstrap/partials/setGlobalErrorHandlers.ts

export async function setGlobalErrorHandlers(): Promise<void> {
  console.debug(`Registering global error handlers`);

  try {
    window.onerror = function (message, source, lineno, colno, error) {
      console.log(
        `Unhandled error: ${message} at ${source}:${lineno}:${colno}`
      );
      if (error && error.stack) {
        console.log(`Stack trace:\n${error.stack}`);
      }
      return false;
    };
    window.addEventListener('unhandledrejection', event => {
      console.log(`Unhandled promise rejection: ${event.reason}`);
    });
  } catch (error) {
    console.error(
      `Failed to register global error handlers: ${error instanceof Error ? error.message : String(error)}`
    );
    throw new Error(`Global error handler registration failed.`);
  }
}
