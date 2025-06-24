import type { Knex } from 'knex';
import path from 'path';

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './dev.db'
    },
    useNullAsDefault: true,
    migrations: {
      directory: path.resolve(__dirname, '../migrations')
    }
  }
};

module.exports = config;
