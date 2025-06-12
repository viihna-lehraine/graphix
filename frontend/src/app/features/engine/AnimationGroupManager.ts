// File: frontend/src/app/features/engine/AnimationGroupManager.ts

import type {
  AnimationGroup,
  AnimationGroupManagerContract
} from '../../types/index.js';

// ================================================== //
// ================================================== //

export class AnimationGroupManager implements AnimationGroupManagerContract {
  static #instance: AnimationGroupManager | null = null;

  #groups: AnimationGroup[] = [];

  private constructor() {}

  static getInstance(): AnimationGroupManager {
    if (!this.#instance) {
      this.#instance = new AnimationGroupManager();
    }
    return this.#instance;
  }

  get groups(): AnimationGroup[] {
    return this.#groups;
  }

  addGroup(group: AnimationGroup): void {
    this.#groups.push(group);
  }

  pause(groupId: string): void {
    const group = this.#groups.find(g => g.id === groupId);
    if (group) group.isPlaying = false;
  }

  play(groupId: string): void {
    const group = this.#groups.find(g => g.id === groupId);
    if (group) group.isPlaying = true;
  }

  removeGroup(groupId: string): void {
    this.#groups = this.#groups.filter(g => g.id !== groupId);
  }

  update(deltaTime: number): void {
    this.#groups.forEach(group => {
      if (!group.isPlaying) return;

      group.layers.forEach(layer => {
        // --- loop through each element in the layer ---
        for (const elem of layer.elements) {
          // --- advance rotation if present (animated_image only) ---
          if (
            elem.kind === 'animated_image' &&
            elem.rotation &&
            elem.rotation.direction !== 'n/a'
          ) {
            const dirFactor = elem.rotation.direction === 'clockwise' ? 1 : -1;
            elem.rotation.currentAngle =
              (elem.rotation.currentAngle +
                dirFactor * (elem.rotation.speed ?? 0) * deltaTime) %
              360;
          }

          // --- advance GIF frames if applicable (animated_image only) ---
          if (elem.kind === 'animated_image' && elem.gifFrames) {
            elem.frameElapsed = (elem.frameElapsed ?? 0) + deltaTime * 1000;
            const frameRate =
              elem.asset.animation !== false
                ? elem.asset.animation.frames.rate
                : 1;
            const frameDuration = 1000 / frameRate;
            while (elem.frameElapsed >= frameDuration) {
              elem.frameElapsed -= frameDuration;
              elem.currentFrame =
                ((elem.currentFrame ?? 0) + 1) % elem.gifFrames.length;
            }
          }
          // ...add other kind-specific logic here
        }
      });
    });
  }
}
