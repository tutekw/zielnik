const db = require('../../../database');
const tableNames = require('../../dictionary');
const userQueries = require('../user/user.queries');
const nodemailer = require('nodemailer'); 

async function addToken(token) {
    await db(tableNames.tokenList).insert(token);
}
async function getTokenData(token){
    return await db(tableNames.tokenList).where({token: token}).first();
}
async function checkTokenValidity(token) {
    const tokenData = await getTokenData(token.split(' ')[1]);
    if(!tokenData) return false;
    if(tokenData.remember_me) return true;
    if(new Date(tokenData.expire_date) < new Date()) {
        await deleteToken(token);
        return false;
    }
    return true;
}
async function updateTokenExpirationDate(token){
	await db(tableNames.tokenList).where({token: token}).update({expire_date: new Date()})
}
async function deleteToken(token) {
    await db(tableNames.tokenList).where({token: token}).delete();
}
async function getUserByToken(token) {
    const tokenData = await getTokenData(token.split(' ')[1]);
    if(!tokenData) return undefined;
    if(tokenData.remember_me) {
        return await userQueries.getUserById(tokenData.user_id);
    }
    if(new Date(tokenData.expire_date) > new Date()) {
        return await userQueries.getUserById(tokenData.user_id);
    }
    await deleteToken(token.split(' ')[1]);
    return undefined;
    
}
async function getCodeData(code){
    const codeData = await db(tableNames.codeList).where({code: code}).first();
    return codeData;
}
async function getUserByCode(code) {
    const codeData = await getCodeData(code);
    return await userQueries.getUserById(codeData.user_id);
}
async function deleteCode(code) {
    await db(tableNames.codeList).where({code: code}).delete();
}

async function deleteResetCodes(id) {
    await db(tableNames.codeList).where({user_id: id, type: 'reset'}).delete();
}

function addHours(numOfHours, date = new Date()) {
	date.setTime(date.getTime() + numOfHours * 60 * 60 * 1000);
	return date;
}

async function generateCode(userMail, codeType) {
    const createdUser = await userQueries.getUserByMail(userMail);

	const code = Math.floor(100000 + Math.random() * 900000);

    await db(tableNames.codeList).insert({
        code: code.toString(),
        type: codeType,
        user_id: createdUser.id
    });

    //sending e-mails with authentication codes

    // let transporter = nodemailer.createTransport({
    //     service: 'gmail',
    //     auth: {
    //         user: 'da.zielnik@gmail.com',
    //         pass: ''
    //     }
    //     });

    //     let mailOptions = {
    //     from: 'da.zielnik@gmail.com',
    //     to: 'henryk.kazmierczak2006@gmail.com',
    //     subject: 'ELO',
    //     text: 'TEST! '.concat(code)
    //     };

    //     transporter.sendMail(mailOptions, function(error, info){
    //     if (error) {
    //         console.log(error);
    //     } else {
    //         console.log('Email sent: ' + info.response);
    //     }
    // }); 
}
module.exports = { addToken, getTokenData, checkTokenValidity, getUserByToken, deleteToken, getCodeData, getUserByCode, deleteCode, deleteResetCodes, updateTokenExpirationDate, addHours, generateCode }