// File: frontend/src/app/features/engine/ui/uploadMode.ts

export let uploadMode: 'background' | 'image' | null = null;

function getUploadMode(): 'background' | 'image' | null {
  return uploadMode;
}

function setUploadMode(mode: 'background' | 'image' | null): void {
  console.info(`setUploadMode: ${mode}`);
  uploadMode = mode;
}

export { getUploadMode, setUploadMode };
