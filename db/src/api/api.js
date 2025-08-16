const express = require('express');
const router = express.Router();
const {rateLimit} = require('express-rate-limit')

const user = require('./user/user.routes')
const location = require('./location/location.routes')
const auth = require('./auth/auth.routes')

const limiter = rateLimit({
    limit: 100,
    windowMs: 15* 60* 1000,
    standardHeaders: true,
    legacyHeaders: false,
    ipv6Subnet: 56
})


router.use('/user', limiter, user);
router.use('/location', limiter, location);
router.use('/auth', auth);

router.get('/', (req, res) => {
	res.json({
        message: "Zielnik Database API; Dobra Aura"
    })
});

module.exports = router;