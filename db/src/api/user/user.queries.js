const tableNames = require('../../dictionary');
const db = require('../../../database');

async function findUserByMail(mail){
	const user = await db(tableNames.userList).where({mail: mail}).first();
	return user;
}

module.exports = { findUserByMail };