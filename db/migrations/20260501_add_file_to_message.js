exports.up = async (knex) => {
  await knex.schema.table('Message', (table) => {
    table.string('FileName', 255).nullable();
    table.string('FileType', 100).nullable();
    table.specificType('FileData', 'MEDIUMBLOB').nullable();
  });
};

exports.down = async (knex) => {
  await knex.schema.table('Message', (table) => {
    table.dropColumn('FileName');
    table.dropColumn('FileType');
    table.dropColumn('FileData');
  });
};
