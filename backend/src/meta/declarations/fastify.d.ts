// File: backend/src/meta/declarations/fastify.d.ts

import type { Knex } from 'knex';

declare module 'fastify' {
  interface FastifyInstance {
    knex: Knex;
  }
}
