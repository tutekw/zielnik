const express = require('express');
const router = express.Router();

const queries = require('./user.queries');
const authQueries = require('../auth/auth.queries');

router.get('/:mail', async (req, res) => {
    const token = req.headers.authorization;
    if(!token) {
        res.status(400).json({
            message: "invalid data"
        });
        return;
    }

    const user = await queries.getUserByMail(req.params.mail);
    if(!user) {
        res.status(400).json({
            message: "invalid data"
        });
        return;
    }

    const tokenUser = await authQueries.getUserByToken(token);
    
    if((tokenUser.mail != req.params.mail) || (!user)) {
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