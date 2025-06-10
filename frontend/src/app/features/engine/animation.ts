// File: frontend/src/app/features/engine/animation.ts

import { decompressFrames, parseGIF } from 'gifuct-js';
import type { GifAnimation, GifFrame } from '../../types/index.js';

export function createGifAnimation(arrayBuffer: ArrayBuffer): GifAnimation {
  const gif = parseGIF(arrayBuffer);
  const rawFrames = decompressFrames(gif, true);

  const frames: GifFrame[] = rawFrames.map(
    (frame): GifFrame => ({
      imageData: new ImageData(
        new Uint8ClampedArray(frame.patch), // ALWAYS convert to Uint8ClampedArray for ImageData
        frame.dims.width,
        frame.dims.height
      ),
      delay: (frame.delay || 10) * 10 // delay is in 0.01s; convert to ms
    })
  );

  let playing = false;
  let frameIndex = 0;
  let rafId: number | null = null;

  function isPlaying(): boolean {
    return playing;
  }

  function drawFrame(ctx: CanvasRenderingContext2D): void {
    const frame = frames[frameIndex];
    ctx.putImageData(frame.imageData, 0, 0);
  }

  function loop(ctx: CanvasRenderingContext2D, loopForever: boolean = true) {
    if (!playing) return;
    drawFrame(ctx);

    const nextDelay = frames[frameIndex].delay;
    frameIndex = (frameIndex + 1) % frames.length;

    if (frameIndex === 0 && !loopForever) {
      stop();
      return;
    }
    rafId = window.setTimeout(() => loop(ctx, loopForever), nextDelay);
  }

  function play(ctx: CanvasRenderingContext2D, loopForever = true) {
    if (playing) return;
    playing = true;
    frameIndex = 0;
    loop(ctx, loopForever);
  }

  function pause() {
    playing = false;
    if (rafId !== null) clearTimeout(rafId);
    rafId = null;
  }

  function stop() {
    pause();
    frameIndex = 0;
  }

  return { frames, isPlaying, play, pause, stop };
}
