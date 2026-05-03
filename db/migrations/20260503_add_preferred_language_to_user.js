exports.up = function (knex) {
  return knex.schema.alterTable('User', (table) => {
    table.string('PreferredLanguage', 10).notNullable().defaultTo('en');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('User', (table) => {
    table.dropColumn('PreferredLanguage');
  });
};
