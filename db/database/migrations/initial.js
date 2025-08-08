const { knex } = require('knex');
const { stringTable, references } = require('../../src/utils/db_table_utils');
const tableNames = require('../../src/dictionary');

exports.up = async (knex) => {
    await knex.schema.createTable(tableNames.userAddressList, (table) => {
		table.increments().notNullable();
		stringTable(table, 'country').notNullable();
		stringTable(table, 'postcode').notNullable();
		stringTable(table, 'city').notNullable();
		stringTable(table, 'street').notNullable();
		stringTable(table, 'street_number').notNullable();
		stringTable(table, 'house_number');
	})
    await knex.schema.createTable(tableNames.userList, (table) => {
		table.increments().notNullable();
		stringTable(table, 'name');
		stringTable(table, 'surname');
		references(table, tableNames.userAddressList, 'address_id', false);
		stringTable(table, 'mail').notNullable();
		table.integer('phone_number');
		stringTable(table, 'password').notNullable();
        table.integer('subscription_type'); //0- free, 1-paid
		table.boolean('active').notNullable();
	})
    await knex.schema.createTable(tableNames.locationList, (table)=> {
        table.increments().notNullable();
        stringTable(table, 'name');
        stringTable(table, 'description');
        stringTable(table, 'type').notNullable();
        table.float('latitude').notNullable();
        table.float('longtitude').notNullable();
        table.datetime('collectionStart', {useTz: false});
		table.datetime('collectionEnd', {useTz: false});
		table.integer('access'); //0-public, 1-private
		references(table, tableNames.userList, 'user_id', false);
    })
	await knex.schema.createTable(tableNames.tokenList, (table) => {
		table.increments().notNullable();
		stringTable(table, 'token');
		table.datetime('expire_date', {useTz: false}).notNullable();
		references(table, tableNames.userList, 'user_id', true);
	})
	await knex.schema.createTable(tableNames.codeList, (table) => {
		table.increments().notNullable();
		stringTable(table, 'code');
		stringTable(table, 'type'); //confirm (email) | reset (password) 
		references(table, tableNames.userList, 'user_id', true);
	})
};
exports.down = async (knex) => {
	await knex.schema.dropTableIfExists(tableNames.tokenList);
	await knex.schema.dropTableIfExists(tableNames.codeList);
	await knex.schema.dropTableIfExists(tableNames.locationList);
    await knex.schema.dropTableIfExists(tableNames.userList);
    await knex.schema.dropTableIfExists(tableNames.userAddressList);

};
