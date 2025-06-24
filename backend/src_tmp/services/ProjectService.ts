

import type {
  Core,
  EnvironmentVariables,
  Project,
  ProjectServiceContract,
  Utilities
} from '../meta/index.js';
import type { Knex } from 'knex';

export class ProjectService implements ProjectServiceContract {
  #knex: Knex;
  #env: EnvironmentVariables;
  #utils: Utilities;

  constructor(knex: Knex, core: Core, env: EnvironmentVariables) {
    this.#knex = knex;
    this.#env = env;
    this.#utils = core.utils;
  }

  async loadProjects(userId: string): Promise<Project[]> {
    return this.#knex('projects')
      .where({ user_id: userId })
      .select('id', 'name', 'data', 'created_at', 'updated_at');
  }

  async saveProject(
    userId: string,
    name: string,
    data: unknown
  ): Promise<{ success: boolean }> {
    const existing = await this.#knex('projects')
      .where({ user_id: userId, name })
      .first();

    if (existing) {
      await this.#knex('projects')
        .where({ user_id: userId, name })
        .update({
          data,
          updated_at: new Date(),
          version: this.#knex.raw('version + 1')
        });
    } else {
      await this.#knex('projects').insert({
        user_id: userId,
        name,
        data,
        slug,
        version: 1,
        tags: JSON.stringify(tags ?? [])
      });
    }

    return { success: true };
  }
}
