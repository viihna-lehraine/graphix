// File: frontend/src/app/sys/registries/ui.ts

import type { Core, Engine, UIInitializer } from '../../types/index.js';

export const uiInitializers: (() => Promise<UIInitializer>)[] = [
  () => import('@engine/ui/init/addImgBtn.js').then(m => m.initializeAddImgBtn),
  () =>
    import('@engine/ui/init/assetBrowserToggleBtn.js').then(
      m => m.initializeAssetBrowserToggleBtn
    ),
  () => import('@engine/ui/init/clearBtn.js').then(m => m.initializeClearBtn),
  () =>
    import('@engine/ui/init/downloadBtn.js').then(m => m.initializeDownloadBtn),
  () =>
    import('@engine/ui/init/setBackgroundBtn.js').then(
      m => m.initializeSetBackgroundBtn
    ),
  () =>
    import('@engine/ui/init/textInputForm.js').then(
      m => m.initializeTextInputForm
    )
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
    '@engine/ui/init/setupTextDragHandlers.js'
  );

  await setupTextDragHandlers(canvas, core, engine);
}
