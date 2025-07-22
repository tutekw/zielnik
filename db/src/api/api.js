const express = require('express');
const router = express.Router();

const user = require('./user/user.routes')
const location = require('./location/location.routes')
const auth = require('./auth/auth.routes')

router.use('/user', user);
router.use('/location', location);
router.use('/auth', auth);

router.get('/', (req, res) => {
	res.json({
        message: "Zielnik Database API; Dobra Aura"
    })
});

module.exports = router;