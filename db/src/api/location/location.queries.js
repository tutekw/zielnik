const tableNames = require('../../dictionary');
const db = require('../../../database');

async function getOne(id){
	const location = await db(tableNames.locationList).where({id: id}).first();
	return location;
}
async function getPublic() {
	return await db(tableNames.locationList).where({access: 0}); 
}
async function get(userId) {
	const data = await db(tableNames.locationList).where({access: 0}).orWhere({user_id: userId});
	return data; 
}
async function getLocationByCoordinates(longitude, latitude) {
	const location = await db(tableNames.locationList)
	.where({
		longitude: longitude,
		latitude: latitude,
	})
	.first();
	return location;
}

async function createLocation(locationData, user_id) {
	await db(tableNames.locationList).insert({
		name: locationData.name || null,
		description: locationData.description || null,
		type: locationData.type,
		longitude: locationData.longitude,
		latitude: locationData.latitude,
		collectionStartMonth: locationData.collectionStartMonth || null,
		collectionEndMonth: locationData.collectionEndMonth || null,
		access: locationData.access,
		user_id: user_id,
	});
}

module.exports = { getOne, getPublic, get, getLocationByCoordinates, createLocation };