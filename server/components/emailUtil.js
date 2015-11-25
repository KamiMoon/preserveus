'use strict';


var ControllerUtil = require('./controllerUtil');
var config = require('../config/environment');


exports.createConfirmationEmail = function(req, user) {
    var host = ControllerUtil.getHostFromRequest(req);

    if (host) {

        var linkAddress = 'http://' + host + '/api/users/activate/' + encodeURIComponent(user._id) + '/' + encodeURIComponent(user.activationHash);

        var body = 'Welcome, <br/>You are registered for Preserve US. <br/><br/>';
        body += 'To activate your account click this link: <a href="' + linkAddress + '">Activate Account</a>';

        var mailOptions = {
            from: process.env.GMAIL, // sender address
            to: user.email, // list of receivers
            subject: 'Confirm Registration', // Subject line
            html: body // html body
        };

        config.transporter.sendMail(mailOptions, function(error) {
            if (error) {
                return console.log(error);
            }
        });
    }


};
