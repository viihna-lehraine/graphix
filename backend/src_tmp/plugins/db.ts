

import type { KnexPlugin } from '../meta/index.js';
import { knex as createKnex, type Knex } from 'knex';
import config from '../config/knexfile.js';

export const knexPlugin: KnexPlugin = async fastify => {
  const knex: Knex = createKnex(config.development);
  fastify.decorate('knex', knex);

  fastify.addHook('onClose', async instance => {
    await instance.knex.destroy();
  });
};
