const express = require('express');
const router = express.Router();

const user = require('./user/user.routes')
const location = require('./location/location.routes')

router.use('/user', user);
router.use('/location', location);

router.get('/', (req, res) => {
	res.json({
        message: "Zielnik Database API; Dobra Aura"
    })
});

module.exports = router;