'use strict';

var express = require('express');
var Chat = require('./chat.model');

//var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/hi', function(req, res) {
    res.json('hi');
});


module.exports = router;
