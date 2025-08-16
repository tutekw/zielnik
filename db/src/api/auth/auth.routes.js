const express = require('express');
const router = express.Router();

const is = require( 'validator.js' ).Assert;
const validator = require('validator.js').validator();

const queries = require('./auth.queries');
const userQueries = require('../user/user.queries');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const db = require('../../../database');
const tableNames = require('../../dictionary');

const {rateLimit} = require('express-rate-limit')

require('dotenv').config();

const codeLimiter = rateLimit({
    limit: 5,
    windowMs: 15* 60* 1000,
    standardHeaders: true,
    legacyHeaders: false,
    ipv6Subnet: 56
})

const authLimiter = rateLimit({
    limit: 50,
    windowMs: 15* 60* 1000,
    standardHeaders: true,
    legacyHeaders: false,
    ipv6Subnet: 56
})

router.get('/', async (req, res) => {
    res.status(200); //check if auth service is connected
});

router.post('/signup', authLimiter, async (req, res) => {
    var constraints = {
        mail: is.email(),
        password: is.notBlank()
    }
    if(validator.validate(req.body, constraints) != true) {
        res.status(400).json({ message: validator.validate(req.body, constraints) });	
        return;
    }


    const user = await userQueries.getUserByMail(req.body.mail);
    console.log(user);
    if(user) {
        var code = 400;
        var message = "There is already an account with this e-mail"
    }
    else{
        await userQueries.createUser(req.body);
        var code = 201;
        var message = "User successfully created";
		queries.generateCode(req.body.mail, "confirm");
    }
    res.status(code).json({ message: message });	
});

router.post('/signin', authLimiter, async (req, res) => {
    const user = await userQueries.getUserByMail(req.body.mail);
	if(!user) {
		res.status(400).json({
			message: 'invalid email'
		});
		return;
	}
	if(!user.active) {
		res.status(202).json({
			message: 'please activate your account'
		});
		return;
	} 

	const passwordMatch = await bcrypt.compare(req.body.password, user.password);
	if(!passwordMatch) {
		res.status(400).json({
			message: 'invalid password'
		})
		return;
	}

	var expirationTime = queries.addHours(1);
	var blankToken = {
		mail: req.body.mail,
		expire_date: expirationTime
	}
	var token = {
		token: jwt.sign(blankToken, process.env.JWT_PASS),
		expire_date: expirationTime,
		user_id: user.id
	}
	await db(tableNames.tokenList).insert(token);
	res.status(201).json({
		message: token
	})
})

router.put('/signout', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    await queries.deleteToken(token);
    res.status(200).json({})
});

router.post('/forgot', codeLimiter, async (req, res) => {
	const user = await userQueries.getUserByMail(req.body.mail);
	if(!user) {
		res.status(400).json({
			message: 'invalid email'
		});
		return;
	}
	await queries.deleteResetCodes(user.id);//disables and removes all previous reset codes from database
	await queries.generateCode(req.body.mail, "reset");
	res.status(200).json({})
});

router.post('/activate', codeLimiter, async (req,res) => {
	const codeData = await queries.getCodeData(req.body.code);
	console.log(codeData);
	if(!codeData || codeData.type != "confirm") {
		res.status(400).json({
			message: 'invalid code'
		})
		return;
	}
	const codeUser = await queries.getUserByCode(req.body.code);
	if(!codeUser.active) {
		console.log(codeUser);
		await userQueries.activateUser(codeUser.id);
		await queries.deleteCode(req.body.code);
		return res.status(200).json({});
	}
	res.status(409).json({
		message: 'user is already activated'
	})
})

router.post('/reset', codeLimiter, async (req,res) => {
	const codeData = await queries.getCodeData(req.body.code);
	console.log(codeData);
	if(!codeData || codeData.type != "reset") {
		res.status(400).json({
			message: 'Invalid code'
		})
		return;
	}
	const codeUser = await queries.getUserByCode(req.body.code);
	if(!codeUser) {
		return res.status(400).json({
			message: 'Account does not exist - invalid code'
		})
	}
	await userQueries.changePassword(codeUser.id, req.body.password);
	await queries.deleteCode(req.body.code);
	return res.status(200).json({});

})


module.exports = router;