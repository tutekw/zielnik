const express = require('express');
const router = express.Router();

const queries = require('./location.queries');
const authQueries = require('../auth/auth.queries');

router.get('/:id', async (req, res) => {
    console.log(req.params.id);
    const location = await queries.getOne(req.params.id);
    res.json(location);
});

router.get('/', async (req,res) => {
    if(!req.headers.authorization) {
        var data = await queries.getPublic();
        res.json(data);
        return;
    }

    const user = await authQueries.getUserByToken(req.headers.authorization);
    if((!user) || (user.subscription_type != 1)) {
        var data = await queries.getPublic();
        res.json(data);
        return;
    }

    const userId = user.id;
    var data = await queries.get(userId);
    res.json(data);
});

router.post('/', async (req,res) =>{
    if(!req.headers.authorization) {
        res.status(402).json({
            message: 'To add new locations, you must first purchase a subscription'
        });
        return;
    }

    const user = await authQueries.getUserByToken(req.headers.authorization);
    if((!user) || (user.subscription_type != 1)) {
        res.status(402).json({
            message: 'To add new locations, you must first purchase a subscription'
        });
        return;
    }
    
    const location = await queries.getLocationByCoordinates(req.body.latitude, req.body.longtitude);
    if(location) {
        res.status(400).json({
            message: 'location already exists'
        })
    }
    else {
        await queries.createLocation(req.body);
        res.status(200).json({
            message: 'location created'
        })
    }
    
});

module.exports = router;