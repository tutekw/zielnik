const tableNames = require('../../dictionary');
const db = require('../../../database');
const encoder = require('../../encoder');

async function getUserByMail(mail) {
	const user = await db(tableNames.userList).where({mail: mail}).first();
	return user;
}
async function getUserById(id) {
	const user = await db(tableNames.userList).where({id: id}).first();
	return user;
}
async function createUser(user){
	await db(tableNames.userList).insert({
		mail: user.mail,
		password: encoder.encryptPassword(user.password),
		active: false
	});
}

async function activateUser(id) {
    await db(tableNames.userList).where({id: id}).update({active: 1})
}

async function changePassword(id, password) {
	await db(tableNames.userList).where({id: id}).update({password: encoder.encryptPassword(password)})
}

module.exports = { getUserByMail, getUserById, createUser, activateUser, changePassword };