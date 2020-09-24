// const { request } = require('../../../app');
const express = require('express');
const router = express.Router();
const mondayFunc = require('./function')


router.get('/members_houers', function (req, res) {
    res.send(mondayFunc.testOne());
})

router.post('/houersTrack', function (req, res) {
    res.json(mondayFunc.fetchAndMutation());
})


module.exports = router;
