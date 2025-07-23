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
require('dotenv').config();

router.get('/', async (req, res) => {
    res.status(200); //check if auth service is connected
});

router.post('/signup', async (req, res) => {
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
    }
    res.status(code).json({ message: message });	
});

router.post('/signin', async (req, res) => {
    const user = await userQueries.getUserByMail(req.body.mail);
	if(!user) {
		res.status(400).json({
			message: 'invalid email'
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
		user: user.id
	}
	await db(tableNames.tokenList).insert(token);
	res.status(201).json({
		message: token
	})
})

router.put('/signout', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    await queries.updateTokenExpirationDate(token);
    res.status(200).json({})
})

module.exports = router;