// File: frontend/src/app/engine/AnimationManager.ts

import type { AnimationGroup, AnimationManagerContract } from '@index';
import { RenderingManager } from '@index';

export class AnimationManager implements AnimationManagerContract {
  static #instance: AnimationManager | null = null;

  #animatedLayers: { advanceFrame: () => void }[] = [];
  #groups: AnimationGroup[] = [];

  private constructor() {
    this.#animatedLayers = [];
  }

  static getInstance(): AnimationManager {
    if (!this.#instance) {
      this.#instance = new AnimationManager();
    }
    return this.#instance;
  }

  get groups(): AnimationGroup[] {
    return this.#groups;
  }

  addGroup(group: AnimationGroup): void {
    this.#groups.push(group);
  }

  clearAllLayers(): void {
    this.#animatedLayers.length = 0;
  }

  pause(groupId: string): void {
    const group = this.#groups.find(g => g.id === groupId);
    if (group) group.isPlaying = false;
  }

  play(groupId: string): void {
    const group = this.#groups.find(g => g.id === groupId);
    if (group) group.isPlaying = true;
  }

  registerAllGifLayers(renderingManager: RenderingManager): void {
    this.#animatedLayers.forEach(layer => {
      renderingManager.registerAnimatable(() => {
        layer.advanceFrame();
      });
    });
  }

  registerLayer(layer: { advanceFrame: () => void }): void {
    this.#animatedLayers.push(layer);
  }

  removeGroup(groupId: string): void {
    this.#groups = this.#groups.filter(g => g.id !== groupId);
  }

  unregisterLayer(layer: { advanceFrame: () => void }): void {
    const index = this.#animatedLayers.indexOf(layer);
    if (index !== -1) {
      this.#animatedLayers.splice(index, 1);
    }
  }

  update(deltaTime: number): void {
    for (const group of this.#groups) {
      if (!group.isPlaying) continue;

      for (const layer of group.layers) {
        const elem = layer.element;

        if (elem.kind === 'animated_image') {
          if (elem.rotation && elem.rotation.direction !== 'n/a') {
            const factor = elem.rotation.direction === 'clockwise' ? 1 : -1;
            elem.rotation.currentAngle =
              (elem.rotation.currentAngle +
                factor * (elem.rotation.speed ?? 0) * deltaTime) %
              360;
          }

          if (elem.gifFrames) {
            elem.frameElapsed = (elem.frameElapsed ?? 0) + deltaTime * 1000;
            const rate =
              elem.asset.animation !== false
                ? elem.asset.animation.frames.rate
                : 1;
            const frameDuration = 1000 / rate;

            while (elem.frameElapsed >= frameDuration) {
              elem.frameElapsed -= frameDuration;
              elem.currentFrame =
                ((elem.currentFrame ?? 0) + 1) % elem.gifFrames.length;
            }
          }
        }
      }
    }
  }
}
