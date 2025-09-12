const tableNames = require('../../src/dictionary');

exports.seed = async function(knex) {
//też usuwa wszystko
  await knex(tableNames.locationList).del()
  await knex(tableNames.locationList).insert([
    {name: 'grzyby', type: 'mushroom', latitude: 21.0, longitude: 52.23, access: 0}
  ]);
  await knex(tableNames.locationList).insert([
    {name: 'ziola', type: 'herb', latitude: 1, longitude: 20, access: 1, user_id: 1}
  ]);
};