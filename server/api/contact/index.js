'use strict';

var express = require('express');
var config = require('../../config/environment');
var ControllerUtil = require('../../components/controllerUtil');

var router = express.Router();


router.post('/contactus', function(req, res) {

    var mailOptions = {
        from: req.email, // sender address
        to: process.env.GMAIL, // list of receivers
        subject: 'Contact US ', // Subject line
        html: req.text // html body
    };

    config.transporter.sendMail(mailOptions, function(error) {
        if (error) {
            return ControllerUtil.handleError(res, error);
        }

        ControllerUtil.success(res, 'Sent');
    });
});

module.exports = router;
