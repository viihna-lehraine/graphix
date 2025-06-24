

import type { Core, EnvironmentVariables } from '../meta/index.js';
import type { FastifyInstance } from 'fastify';
import { ProjectService } from '../meta/index.js';
import { requireAuth } from './auth_middleware.js';

export async function projectRoutes(
  fastify: FastifyInstance,
  core: Core,
  env: EnvironmentVariables
): Promise<void> {
  const projectService = new ProjectService(fastify.knex, core, env);

  fastify.delete(
    '/delete/:id',
    { preHandler: requireAuth },
    async (req, res) => {
      const { id } = req.params as { id: string };
      const userId = req.user.userId;

      const deleted = await fastify
        .knex('projects')
        .where({ id, user_id: userId })
        .del();

      if (!deleted) {
        return res.status(404).send({ error: 'Project not found' });
      }

      return { success: true };
    }
  );

  fastify.get('/load', { preHandler: requireAuth }, async (req, _res) => {
    const userId = req.user.userId;
    const projects = await projectService.loadProjects(userId);
    return { projects };
  });

  fastify.post('/save', { preHandler: requireAuth }, async (req, res) => {
    const { name, data } = req.body as { name?: string; data?: unknown };

    if (!name || data === undefined) {
      return res.status(400).send({ error: 'Missing project name or data' });
    }

    const userId = req.user.userId;
    const result = await projectService.saveProject(userId, name, data);
    return result;
  });

  fastify.get('/:slug', { preHandler: requireAuth }, async (req, res) => {
    const { slug } = req.params as { slug: string };
    const userId = req.user.userId;

    const project = await fastify
      .knex('projects')
      .where({ slug, user_id: userId })
      .first();

    if (!project) {
      return res.status(404).send({ error: 'Project not found' });
    }

    return { project };
  });
}
