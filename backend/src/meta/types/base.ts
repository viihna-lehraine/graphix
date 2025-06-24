// File: backend/src/src/meta/types/base.ts

import type { Core, EnvironmentVariables } from '../index.js';
import { AuthService, JWTService, ProjectService } from '../index.js';
import type { IncomingMessage, ServerResponse } from 'node:http';
import type { FastifyBaseLogger } from 'fastify/types/logger.js';
import type { FastifyPluginOptions } from 'fastify/types/plugin.js';
import type { FastifyInstance } from 'fastify/types/instance.js';
import type { FastifyReply } from 'fastify/types/reply.js';
import type { FastifyRequest } from 'fastify/types/request.js';
import type { RawServerDefault } from 'fastify/types/utils.js';

export type KnexPlugin = (
  fastify: FastifyInstance<
    RawServerDefault,
    IncomingMessage,
    ServerResponse,
    FastifyBaseLogger
  >,
  opts: FastifyPluginOptions
) => Promise<void>;

export interface Middleware {
  requireAuth: (req: FastifyRequest, res: FastifyReply) => void;
}

export interface Plugins {
  knex: KnexPlugin;
}

export interface Project {
  id: string;
  name: string;
  data: unknown;
  created_at: string;
  updated_at: string;
}

export interface Routes {
  auth: (fastify: FastifyInstance) => void;
  projects: (
    fastify: FastifyInstance,
    core: Core,
    env: EnvironmentVariables
  ) => void;
}

export interface Services {
  authService: AuthService;
  jwtService: JWTService;
  projectService: ProjectService;
}
