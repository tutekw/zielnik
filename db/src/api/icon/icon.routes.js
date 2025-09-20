const path = require('path');
const express = require('express');
const router = express.Router();

const assetsPath = path.join(__dirname, '../../../public/assets/');

router.get('/:icon', async (req, res) => {
    const name = req.params.icon;
    try {
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
        res.sendFile(path.join(assetsPath, name));
    }
    catch {
        res.status(400).json({});
    }
    finally {
        return;
    }
});

module.exports = router;