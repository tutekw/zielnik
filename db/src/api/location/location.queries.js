const tableNames = require('../../dictionary');
const db = require('../../../database');

async function getOne(id){
	const location = await db(tableNames.locationList).where({id: id}).first();
	return location;
}
function getAll() {
	return db(tableNames.locationList).select('*'); 
}
async function findLocationByCoordinates(latitude, longtitude) {
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

module.exports = { getOne, getAll, findLocationByCoordinates, createLocation };