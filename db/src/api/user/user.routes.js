const express = require('express');
const router = express.Router();

const queries = require('./user.queries');

router.get('/:mail', async (req, res) => {
    console.log(req.params.mail)
    const user = await queries.findUserByMail(req.params.mail)
    res.json({
        name: user.name,
        surname: user.surname,
        mail: user.mail,
        phone_number: user.phone_number,
        subscription_type: user.subscription_type
    });
});

module.exports = router;