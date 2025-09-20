const express = require('express');
const router = express.Router();

const queries = require('./user.queries');
const authQueries = require('../auth/auth.queries');

router.get('/', async (req, res) => {
    const token = req.headers.authorization;
    if(!token) {
        res.status(401).json({
            message: "Unauthorized"
        });
        return;
    }
    const tokenUser = await authQueries.getUserByToken(token);

    if(!tokenUser) {
        return res.status(400).json({
            message: "Invalid token"
        });
    }

    const address = await queries.getUserAddress(tokenUser.address_id);
    const subscription = await queries.getSubscriptionById(tokenUser.subscription_id);

    res.status(200).json({
        id: tokenUser.id,
        name: tokenUser.name,
        surname: tokenUser.surname,
        mail: tokenUser.mail,
        phone_code: tokenUser.phone_code,
        phone_number: tokenUser.phone_number,
        address: address,
        subscription: subscription
    });
});

router.get('/:mail', async (req, res) => {
    const token = req.headers.authorization;
    if(!token) {
        res.status(401).json({
            message: "Unauthorized"
        });
        return;
    }

    const user = await queries.getUserByMail(req.params.mail);
    const tokenUser = await authQueries.getUserByToken(token);

    if((!user) || (!tokenUser) || (tokenUser.mail != req.params.mail)) {
        res.status(400).json({
            message: "invalid data"
        });
        return;
    }

    const address = await queries.getUserAddress(user.address_id);
    const subscription = await queries.getSubscriptionById(user.subscription_id);

    res.json({
        id: tokenUser.id,
        name: tokenUser.name,
        surname: tokenUser.surname,
        mail: tokenUser.mail,
        phone_code: tokenUser.phone_code,
        phone_number: tokenUser.phone_number,
        address: address,
        subscription: subscription
    });
});

router.post('/update', async (req, res) => {
    const token = req.headers.authorization;
    if(!token) {
        res.status(401).json({
            message: "Unauthorized"
        });
        return;
    } //that statement is probably useless because of previous JWT authentication

    const tokenUser = await authQueries.getUserByToken(token);
    if(!tokenUser) {
        res.status(400).json({
            message: "invalid data"
        });
        return;
    }

    await queries.updateUserData(tokenUser.id, req.body);
    res.status(200).json({
        message: 'Changes saved'
    });
    return;
});

router.post('/subscription', async (req,res) => {
    const token = req.headers.authorization;
    const tokenUser = await authQueries.getUserByToken(token);

    if(tokenUser.subscription_id == null) {
        await queries.addSubscription(tokenUser.id, req.body.subscription_type);
        return res.status(200).json({});
    }
    //if user changes their subscription

    //payment validation system
    const update = await queries.updateSubscription(tokenUser.subscription_id, req.body.subscription_type);
    if(!update) {
        return res.status(400).json({
            message: 'User already has this type of subscription',
        })
    }
    return res.status(200).json({});
    
});

router.post('/address', async (req,res) => {
    const token = req.headers.authorization;
    console.log(token);
    const tokenUser = await authQueries.getUserByToken(token);
    console.log(tokenUser);
    console.log(tokenUser.address_id);

    if(tokenUser.address_id == null) {
        console.log("BEZ ADRESU")
        await queries.addUserAddress(tokenUser.id, req.body);
        return res.status(200).json({})
    }

    await queries.updateUserAddress(tokenUser.address_id, req.body);
    return res.status(200).json({})
})

module.exports = router;