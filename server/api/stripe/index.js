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

function validateAndCreateReceiptForProperty(request, callback) {
    var stripeToken = request.body.stripeToken;
    var amount = request.body.amount;
    var user_id = request.body.user_id;
    var model_id = request.body.model_id;

    //validate request
    if (!stripeToken || !amount || !user_id || !model_id) {
        return callback('Invalid request.');
    }

    //validate payment amount
    if (!isNumeric(amount) || amount <= 0) {
        return callback('Invalid amount.');
    }

    //validate user exists
    User.findById(user_id, function(err, user) {
        if (err) {
            return callback('Error looking up user.');
        }

        if (!user) {
            return callback('Unauthorized');
        }

        if (!user.activated) {
            return callback('User not activated.');
        }

        console.log('Found user');
        console.log(user);

        //validate model exists
        Property.findById(model_id, function(err, property) {
            if (err) {
                return callback('Error looking up property.');
            }

            if (!property) {
                return callback('Invalid property.');
            }

            console.log('Found property');
            console.log(property);

            var receipt = {
                user_id: user._id,
                user_name: user.name,
                email: user.email,
                amount: amount,
                stripeCustomerId: null,
                model: 'Property',
                description: property.fullAddress,
                model_id: model_id,
                paymentSystem: 'Stripe',
                confirmation: null
            };

            console.log('Initial receipt');
            console.log(receipt)

            callback(null, {
                user: user,
                receipt: receipt
            });
        });
    });
}



router.post('/investInProperty', function(request, res) {
    var stripeToken = request.body.stripeToken;
    var description = 'Investment in ';

    validateAndCreateReceiptForProperty(request, function(err, result) {
        if (err) {
            return ControllerUtil.handleError(res, err);
        }

        var receipt = result.receipt;
        var user = result.user;

        receipt.description = description + receipt.description;
        receipt.type = 'Investment';

        StripeService.chargeCustomer(stripeToken, user, receipt, function(err, finalResult) {
            if (err) {
                return ControllerUtil.handleError(res, err);
            }

            return ControllerUtil.success(res, 'success');
        })
    });

});

router.post('/payRentForPropertyOnce', function(request, res) {
    var stripeToken = request.body.stripeToken;
    var description = 'One time rental payment for ';

    validateAndCreateReceiptForProperty(request, function(err, result) {
        if (err) {
            return ControllerUtil.handleError(res, err);
        }

        var receipt = result.receipt;
        var user = result.user;

        receipt.description = description + receipt.description;
        receipt.type = 'Rent';

        StripeService.chargeCustomer(stripeToken, user, receipt, function(err, finalResult) {
            if (err) {
                return ControllerUtil.handleError(res, err);
            }

            return ControllerUtil.success(res, 'success');
        })
    });

});

module.exports = router;
