'use strict';

var express = require('express');
var config = require('../../config/environment');
var ControllerUtil = require('../../components/controllerUtil');

var router = express.Router();


router.post('/contactus', function(req, res) {

    if (!req.body.name || !req.body.email || !req.body.message) {
        return ControllerUtil.handleError(res, 'Invalid input');
    }

    //reCacptcha
    config.verifyRecaptcha(req, function(error, result) {

        if (error) {
            return ControllerUtil.handleError(res, 'Invalid Captcha');
        }

        var mailOptions = {
            from: process.env.GMAIL, // sender address
            to: [process.env.GMAIL, 'erickizaki@gmail.com'], // list of receivers
            subject: 'Website contact from - ' + req.body.name + ' - ' + req.body.email, // Subject line
            html: req.body.message // html body
        };

        config.transporter.sendMail(mailOptions, function(error) {
            if (error) {
                return ControllerUtil.handleError(res, error);
            }

            return ControllerUtil.success(res, 'Sent');
        });

    });

});

module.exports = router;
