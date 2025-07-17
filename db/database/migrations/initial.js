const { knex } = require('knex');
const { stringTable, references } = require('../../src/utils/db_table_utils');
const tableNames = require('../../src/dictionary')

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
		stringTable(table, 'name').notNullable();
		stringTable(table, 'surname');
		references(table, tableNames.userAddressList, 'address_id', false);
		stringTable(table, 'mail').notNullable();
		table.integer('phone_number');
		stringTable(table, 'password').notNullable();
        table.integer('subscription_type');
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
    })
};
exports.down = async (knex) => {
    await knex.schema.dropTableIfExists(tableNames.userList);
    await knex.schema.dropTableIfExists(tableNames.userAddressList);
    await knex.schema.dropTableIfExists(tableNames.locationList);
};
