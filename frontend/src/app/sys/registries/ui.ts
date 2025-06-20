// File: frontend/src/app/sys/registries/ui.ts

import type { Core, Engine, UIInitializer } from '../../types/index.js';

export const uiInitializers: (() => Promise<UIInitializer>)[] = [
  () => import('@engine/ui/initAddImgBtn.js').then(m => m.initializeAddImgBtn),
  () =>
    import('@engine/ui/initAssetBrowserToggleBtn.js').then(
      m => m.initializeAssetBrowserToggleBtn
    ),
  () => import('@engine/ui/initClearBtn.js').then(m => m.initializeClearBtn),
  () =>
    import('@engine/ui/initDownloadBtn.js').then(m => m.initializeDownloadBtn),
  () =>
    import('@engine/ui/initSetBackgroundBtn.js').then(
      m => m.initializeSetBackgroundBtn
    ),
  () =>
    import('@engine/ui/textInputForm.js').then(m => m.initializeTextInputForm)
];

export async function registerEngineUIInitializers(
  core: Core,
  engine: Engine
): Promise<void> {
  for (const initializerFactory of uiInitializers) {
    const initializer = await initializerFactory();
    await initializer({ core, engine });
  }

  const canvas = document.getElementById(
    core.data.dom.ids.canvas
  ) as HTMLCanvasElement | null;
  if (!canvas) throw new Error(`Canvas element not found.`);

  const { setupTextDragHandlers } = await import(
    '@engine/ui/setupTextDragHandlers.js'
  );

  await setupTextDragHandlers(canvas, core, engine);
}
