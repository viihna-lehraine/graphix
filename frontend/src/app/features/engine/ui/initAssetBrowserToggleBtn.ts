// File: frontend/src/app/features/engine/ui/initAssetBrowserToggleBtn.ts

import type { Core, Engine } from '../../../types/index.js';

// @typescript-eslint/no-unused-vars
export async function initializeAssetBrowserToggleBtn({
  core,
  engine
}: {
  core: Core;
  engine: Engine;
}): Promise<void> {
  if (core.data.flags.false) console.debug(`NO_OP PRINT: ${engine}`);

  const getElement = core.helpers.data.getElement;
  const ids = core.data.dom.ids;

  const btn = getElement(ids.toggleAssetBrowserBtn) as HTMLButtonElement;
  const browser = getElement(ids.assetBrowserDiv) as HTMLDivElement;

  btn.addEventListener('click', () => {
    browser.classList.toggle('open');
  });

  document.addEventListener('click', (e: MouseEvent) => {
    if (!browser.contains(e.target as Node) && e.target !== btn) {
      browser.classList.remove('open');
    }
  });
}
