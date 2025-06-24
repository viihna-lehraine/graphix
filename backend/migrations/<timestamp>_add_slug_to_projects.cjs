// File: backend/migrations/<timestamp>_add_slug_to_projects.cjs

export async function down(knex) {
  await knex.schema.alterTable('projects', table => {
    table.dropColumn('slug');
  });
}

export async function up(knex) {
  await knex.schema.alterTable('projects', table => {
    table.string('slug').unique().notNullable().defaultTo('');
  });
}
