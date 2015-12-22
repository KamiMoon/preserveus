'use strict';

var express = require('express');
var ControllerUtil = require('../../components/controllerUtil');


var StripeService = require('./stripe.service');

var User = require('../user/user.model');
var Property = require('../property/property.model');

var router = express.Router();

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

router.post('/investInProperty', function(request, res, next) {
    var stripeToken = request.body.stripeToken;
    var amount = request.body.amount;
    var user_id = request.body.user_id;
    var model_id = request.body.model_id;

    var description = 'Investment in ';

    //validate request
    if (!stripeToken || !amount || !user_id || !model_id) {
        return ControllerUtil.handleError(res, 'Invalid request.');
    }

    //validate payment amount
    if (!isNumeric(amount) || amount <= 0) {
        return ControllerUtil.handleError(res, 'Invalid amount.');
    }

    //validate user exists
    User.findById(user_id, function(err, user) {
        if (err) {
            return ControllerUtil.handleError(res, 'Error looking up user.');
        }

        if (!user) {
            return res.status(401).send('Unauthorized');
        }

        if (!user.activated) {
            return res.status(401).send('User not activated.');
        }

        console.log('Found user');
        console.log(user);

        //validate model exists
        Property.findById(model_id, function(err, property) {
            if (err) {
                return ControllerUtil.handleError(res, 'Error looking up property.');
            }

            if (!property) {
                return ControllerUtil.handleError(res, 'Invalid property.');
            }

            console.log('Found property');
            console.log(property);

            description += property.fullAddress;

            var receipt = {
                user_id: user._id,
                user_name: user.name,
                email: user.email,
                description: description,
                amount: amount,
                stripeCustomerId: null,
                model: 'Property',
                model_id: model_id,
                paymentSystem: 'Stripe',
                confirmation: null
            };

            console.log('Initial receipt');
            console.log(receipt)

            StripeService.chargeCustomer(stripeToken, user, receipt, function(err, result) {
                if (err) {
                    return ControllerUtil.handleError(res, err);
                }

                return ControllerUtil.success(res, 'success');
            })

        });
    });

});

module.exports = router;
