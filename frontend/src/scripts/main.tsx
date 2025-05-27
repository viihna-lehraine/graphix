// File: frontend/src/scripts/main.tsx

import { StrictMode } from 'react';
import { App } from './react/App.js';
import ReactDOM from 'react-dom/client';

// =================================================== //
// =================================================== //

async function startApp(): Promise<void> {
  const timestamp_1 = Date.now();
  console.log(`The application is starting up.`);
  console.log(`Started at: ${new Date(timestamp_1).toISOString()}`);

  const { initializeApp } = await import('./app/initialize.js');
  const { helpers, services, utilities } = await initializeApp();
  console.log(
    `Successfully created the Helpers, Services, and Utilities objects.`,
    JSON.stringify({ helpers, services, utilities }, null, 2)
  );
  const log = services.log;
  log.info(`App initialization complete. Proceeding to bootstrap process.`);
  const timestamp_2 = Date.now();
  log.info(`Timestamp: ${new Date(timestamp_2).toISOString()}`);

  const { bootstrap } = await import('./app/bootstrap.js');
  await bootstrap(services);

  const root = ReactDOM.createRoot(document.getElementById('root')!);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

// =================================================== //
// =================================================== //

if (document.readyState === 'loading') {
  try {
    document.addEventListener('DOMContentLoaded', startApp);
  } catch (error) {
    console.error(`An error occurred while setting up the DOMContentLoaded event listener:`, error);
    throw new Error(`Failed to set up DOMContentLoaded event listener.`);
  }
} else {
  startApp().catch(error => {
    console.error(`An error occurred during app startup:`, error);
    throw new Error(`App startup failed.`);
  });
}
