// File: frontend/src/app/core/services/dom/AnimationGroupManager.ts

import type {
  AnimationGroup,
  AnimationGroupManagerContract
} from '../../../types/index.js';

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
        // advance rotation if present
        if (layer.rotation && layer.rotation.direction !== 'n/a') {
          const dirFactor = layer.rotation.direction === 'clockwise' ? 1 : -1;
          layer.rotation.currentAngle =
            (layer.rotation.currentAngle +
              dirFactor * layer.rotation.speed * deltaTime) %
            360;
        }

        // advance GIF frames if applicable
        if (layer.type === 'gif') {
          layer.frameElapsed = (layer.frameElapsed ?? 0) + deltaTime * 1000;

          const frameDuration = 1000 / (layer.animationProps?.frames.rate || 1);

          while (layer.frameElapsed >= frameDuration) {
            layer.frameElapsed -= frameDuration;
            layer.currentFrame =
              ((layer.currentFrame ?? 0) + 1) % layer.gifFrames.length;
          }
        }
      });
    });
  }
}
