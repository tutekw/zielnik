const db = require('../../../database');
const tableNames = require('../../dictionary');
const userQueries = require('../user/user.queries');

function getTokenData(token){
    return db(tableNames.tokenList).where({token: token}).first();
}
async function updateTokenExpirationDate(token){
	await db(tableNames.tokenList).where({token: token}).update({expire_date: new Date()})
}
async function getUserByToken(token) {
    const tokenData = await getTokenData(token.split(' ')[1]);
    const tokenUser = await userQueries.getUserById(tokenData.user);
    return tokenUser;
}
function addHours(numOfHours, date = new Date()) {
	date.setTime(date.getTime() + numOfHours * 60 * 60 * 1000);
	return date;
}
module.exports = { getTokenData, getUserByToken, updateTokenExpirationDate, addHours }