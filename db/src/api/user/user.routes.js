const express = require('express');
const router = express.Router();

const queries = require('./user.queries');
const authQueries = require('../auth/auth.queries');

router.get('/', async (req, res) => {
    const token = req.headers.authorization;
    if(!token) {
        res.status(403);
        return;
    }
    const tokenUser = await authQueries.getUserByToken(token);

    if(!tokenUser) {
        res.status(400).json({
            message: "Invalid token"
        });
        return;
    }

    const address = await queries.getUserAddress(tokenUser.address_id);
    const subscription = await queries.getSubscriptionById(tokenUser.subscription_id);

    res.status(200).json({
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
        name: user.name,
        surname: user.surname,
        mail: user.mail,
        phone_code: user.phone_code,
        phone_number: user.phone_number,
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
    }

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

module.exports = router;