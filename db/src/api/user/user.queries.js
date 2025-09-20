const tableNames = require('../../dictionary');
const db = require('../../../database');
const encoder = require('../../encoder');

function getSubscriptionExpireDate(subscription_type) {
	var date;
	if(subscription_type) {
		date = new Date;
		date.setTime(date.getTime() + 720 * 60 * 60 * 1000); //720 hours = 30 days
	}
	else {
		date = null;
	}
	return date;
}

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

async function addSubscription(userId, subscription_type) {

	const date = getSubscriptionExpireDate(subscription_type);

	const [inserted] = await db(tableNames.subscriptionList).insert({
		subscription_type: subscription_type,
		expire_date: date
	}).returning('id');
	const subId = inserted.id;
	console.log(userId);

	await db(tableNames.userList).where({id: userId}).update({subscription_id: subId}); 
	return;
}

async function updateSubscription(subId, subscription_type) {
	const subscription = await db(tableNames.subscriptionList).where({id: subId}).first();
	if(subscription.subscription_type == subscription_type) return false;

	const date = getSubscriptionExpireDate(subscription_type);

	await db(tableNames.subscriptionList).where({id: subId}).update({subscription_type: subscription_type});
	return true;
}

async function getUserAddress(addressId) {
	const address = await db(tableNames.userAddressList).where({id: addressId}).first();
	return address;
}

async function addUserAddress(userId, address) {
	console.log(address);
	const [inserted] = await db(tableNames.userAddressList).insert({
		country: address.country,
		postcode: address.postcode,
		city: address.city,
		street: address.street,
		street_number: address.street_number,
		house_number: (address.house_number ? address.house_number : null)
	}).returning('id');
	const addressId = inserted.id;

	await db(tableNames.userList).where({id: userId}).update({address_id: addressId});
	return;
}

async function updateUserAddress(addressId, address) {
	await db(tableNames.userAddressList).where({id: addressId}).update({
		country: address.country,
		postcode: address.postcode,
		city: address.city,
		street: address.street,
		street_number: address.street_number,
		house_number: (address.house_number ? address.house_number : null)
	});
	return;
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



module.exports = { getUserByMail, getUserById, createUser, activateUser, changePassword, getSubscriptionById, addSubscription, updateSubscription, getUserAddress, addUserAddress, updateUserAddress, updateUserData };