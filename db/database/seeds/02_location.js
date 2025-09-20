const tableNames = require('../../src/dictionary');

exports.seed = async function(knex) {
//też usuwa wszystko
  await knex(tableNames.locationList).del()
  await knex(tableNames.locationList).insert([
    {type: 'mushroom', longitude: 21.0, latitude: 52.23, collectionStartMonth: 5, collectionEndMonth: 9, access: 0, }
    //Od września do maja
  ]);
  await knex(tableNames.locationList).insert([
    {name: 'ziola', type: 'herb', longitude: 21.0, latitude: 52,  access: 1, user_id: 1}
  ]);
};