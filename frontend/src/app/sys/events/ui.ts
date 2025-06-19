// File: frontend/src/app/sys/events/ui.ts

export async function addEngineUIEventListeners(): Promise<void> {
  const { getUploadMode } = await import('@engine/ui/uploadMode.js');
  const imgInput = document.getElementById(
    'img-input'
  ) as HTMLInputElement | null;
  if (!imgInput) {
    throw new Error('Image input element not found.');
  }

  imgInput.addEventListener('change', async (e: Event) => {
    if (getUploadMode && getUploadMode() === 'background') {
      const input = e.target as HTMLInputElement;
      const file = input.files && input.files[0];
      if (!file) return;

      const reader = new FileReader();

      reader.onload = () => {
        if (typeof reader.result !== 'string') {
          throw new Error('FileReader result is not a string!');
        }
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.getElementById(
            'main-canvas'
          ) as HTMLCanvasElement | null;
          if (!canvas) {
            throw new Error('Canvas element not found for background setting.');
          }

          const ctx = canvas.getContext('2d');
          if (!ctx) throw new Error('2D context not available for canvas!');

          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };

        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  });
}
