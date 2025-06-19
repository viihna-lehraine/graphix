// File: frontend/src/app/features/engine/ui/init/assetBrowserToggleBtn.ts

import type { Core, Engine } from '../../../../types/index.js';

// @typescript-eslint/no-unused-vars
export async function initializeAssetBrowserToggleBtn({
  core,
  engine
}: {
  core: Core;
  engine: Engine;
}): Promise<void> {
  if (core.data.flags.false) console.debug(`NO_OP PRINT: ${engine}`);

  const btn = document.getElementById(
    core.data.dom.ids.toggleAssetBrowserBtn
  ) as HTMLButtonElement | null;
  const browser = document.getElementById(
    core.data.dom.ids.assetBrowserDiv
  ) as HTMLDivElement | null;
  if (!btn) throw new Error(`Asset Browser Toggle Button not found!`);
  if (!browser) throw new Error(`Asset Browser Div not found!`);

  btn.addEventListener('click', () => {
    browser.classList.toggle('open');
  });

  document.addEventListener('click', (e: MouseEvent) => {
    if (!browser.contains(e.target as Node) && e.target !== btn) {
      browser.classList.remove('open');
    }
  });
}
