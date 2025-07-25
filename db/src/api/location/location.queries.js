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
async function getLocationByCoordinates(latitude, longtitude) {
	const location = await db(tableNames.locationList)
	.where({
		latitude: latitude,
		longtitude: longtitude
	})
	.first();
	return location;
}

async function createLocation(locationData) {
	await db(tableNames.locationList).insert({
		name: locationData.name,
		type: locationData.type,
		latitude: locationData.latitude,
		longtitude: locationData.longtitude
	});
}

module.exports = { getOne, getPublic, get, getLocationByCoordinates, createLocation };