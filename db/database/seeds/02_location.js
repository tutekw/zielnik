const tableNames = require('../../src/dictionary');

exports.seed = async function(knex) {
//też usuwa wszystko
  await knex(tableNames.locationList).del()
  await knex(tableNames.locationList).insert([
    {name: 'grzyby', type: 'mushroom', latitude: 1, longtitude: 20}
  ]);
};