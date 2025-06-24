// File: backend/src/plugins/index.ts

import type { Plugins } from '../meta/index.js';
import { knexPlugin as knex } from './db.js';

export const plugins: Plugins = { knex } as const;
