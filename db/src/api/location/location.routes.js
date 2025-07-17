const express = require('express');
const router = express.Router();

const queries = require('./location.queries');

router.get('/:id', async (req, res) => {
    console.log(req.params.id);
    const location = await queries.getOne(req.params.id);
    res.json(location);
});

router.get('/', async (req,res) => {
    const data = await queries.getAll();
    res.json(data);
});

router.post('/', async (req,res) =>{
    const location = await queries.findLocationByCoordinates(req.body.latitude, req.body.longtitude);
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