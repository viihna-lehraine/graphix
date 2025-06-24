// File: backend/migrations/*_init_schema.cjs

/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function (knex) {
  await knex.schema.createTable('users', table => {
    table.uuid('id').primary();
    table.string('email').notNullable().unique();
    table.string('password_hash').notNullable();
    table.timestamps(true, true);
  });
  await knex.schema.alterTable('projects', table => {
    table.integer('version').defaultTo(1);
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('projects');
  await knex.schema.dropTableIfExists('users');
  await knex.schema.alterTable('projects', table => {
    table.dropColumn('version');
  });
};
