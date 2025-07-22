const tableNames = require('../../dictionary');
const db = require('../../../database');
const encoder = require('../../encoder');

async function getUserByMail(mail){
	const user = await db(tableNames.userList).where({mail: mail}).first();
	return user;
}
async function getUserById(id) {
	const user = await db(tableNames.userList).where({id: id}).first();
	return user;
}
async function createUser(user){
	await db('user_list').insert({
		mail: user.mail,
		password: encoder.encryptPassword(user.password)
	});
}

module.exports = { getUserByMail, getUserById, createUser };