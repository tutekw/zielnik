const express = require('express');
const router = express.Router();

const queries = require('./user.queries');
const authQueries = require('../auth/auth.queries');

router.get('/', async (req, res) => {
    const token = req.headers.authorization;
    if(!token) {
        res.status(400).json({
            message: "Missing authorization token"
        });
        return;
    }
    const tokenUser = await authQueries.getUserByToken(token);

    if(!tokenUser) {
        res.status(400).json({
            message: "Invalid token"
        });
        return;
    }

    res.status(200).json({
        name: tokenUser.name,
        surname: tokenUser.surname,
        mail: tokenUser.mail,
        subscription_type: tokenUser.subscription_type
    });
});

router.get('/:mail', async (req, res) => {
    const token = req.headers.authorization;
    if(!token) {
        res.status(400).json({
            message: "invalid data"
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

    res.json({
        name: user.name,
        surname: user.surname,
        mail: user.mail,
        phone_number: user.phone_number,
        subscription_type: user.subscription_type
    });
});

module.exports = router;