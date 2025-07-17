const tableNames = require('../../src/dictionary');

exports.seed = async function(knex) {
//usuwa wszystko
  await knex(tableNames.userAddressList).del()
  await knex(tableNames.userList).del()
  await knex(tableNames.userAddressList).insert([
    {country: 'Poland', postcode: '44-000', city: 'Katowice', street: 'Rynek', street_number: '5', house_number: '2'}
  ]);
	await knex(tableNames.userList).insert([
		{name: 'Henryk', surname: 'K', address_id: 1, mail: 'henryk@rmf.fm', phone_number: 123456789, password: "123", subscription_type: 1}
	]);
};
