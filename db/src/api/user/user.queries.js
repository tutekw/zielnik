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

async function getUserAddress(addressId) {
	const address = await db(tableNames.userAddressList).where({id: addressId}).first();
	return address;
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
	return;
}

async function changePassword(id, password) {
	await db(tableNames.userList).where({id: id}).update({password: encoder.encryptPassword(password)});
	return;
}

async function getSubscriptionById(subId) {
	const subscription = await db(tableNames.subscriptionList).where({id: subId}).first();
	return subscription;
}

async function updateUserData(userId, data) {
	await db(tableNames.userList).where({id: userId}).update({
		name: data.name,
		surname: data.surname,
		phone_code: data.phone_code,
		phone_number: data.phone_number
	})
	return;
}



module.exports = { getUserByMail, getUserById, getUserAddress, createUser, activateUser, changePassword, getSubscriptionById, updateUserData };