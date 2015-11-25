'use strict';

var express = require('express');
var config = require('../../config/environment');

var router = express.Router();


router.get('/sign', function(req, res) {

    var params = config.cloudinary.utils.sign_request({
        timestamp: config.cloudinary.utils.timestamp(),
        transformation: req.params.transformation, //whatever options you want here per cloudinary docs
        format: req.params.format
    });

    res.json(params);
});



module.exports = router;
