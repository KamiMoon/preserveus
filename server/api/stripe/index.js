'use strict';

var express = require('express');
var ControllerUtil = require('../../components/controllerUtil');

// Set your secret key: remember to change this to your live secret key in production
// See your keys here https://dashboard.stripe.com/account/apikeys
var stripe = require('stripe')('sk_test_hdEpFYjqCu8t9QHg1DwXdCta');
var EmailUtil = require('../../components/emailUtil');
var Receipt = require('./receipt.model');
var User = require('../user/user.model');
var Property = require('../property/property.model');

var router = express.Router();


function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function chargeCustomer(receipt, callback) {
    var amountCents = receipt.amount * 100;

    console.log(receipt);

    stripe.charges.create({
        amount: amountCents, // amount in cents, again
        currency: 'usd',
        customer: receipt.stripeCustomerId,
        description: receipt.description
    }, function(err, charge) {
        if (err && err.type === 'StripeCardError') {
            // The card has been declined
            return callback(err);
        }

        console.log('Charge');
        console.log(charge);

        receipt.confirmation = charge.id;

        //save in database
        Receipt.create(receipt, function(err, createdReceipt) {
            if (err) {
                console.log('Error creating receipt');
                console.log(err);

                return callback(err);
            }

            console.log('Created Receipt');
            console.log(createdReceipt);
            //send receipt email
            EmailUtil.createReceiptEmail(createdReceipt);

            return callback(err, createdReceipt);
        });
    });
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
                //create Customer if not existing
            if (!user.stripeCustomerId) {

                stripe.customers.create({
                    source: stripeToken,
                    description: user._id.toString(),
                    email: user.email
                }).then(function(customer) {

                    console.log('New Customer');
                    console.log(customer);
                    receipt.stripeCustomerId = customer.id;


                    chargeCustomer(receipt, function(err, charge) {
                        if (err) {
                            return ControllerUtil.handleError(res, 'Error Charging Card.');
                        }

                        user.stripeCustomerId = receipt.stripeCustomerId;
                        //save customerId on the user
                        user.save(function(err) {
                            if (err) return next(res, err);

                            return res.redirect('/paymentSuccess');
                        });
                    });
                });

            } else {
                //customer already exists - just recharge to them
                receipt.stripeCustomerId = user.stripeCustomerId;

                console.log('Existing Customer: ' + receipt.stripeCustomerId);

                chargeCustomer(receipt, function(err, charge) {
                    if (err) {
                        return ControllerUtil.handleError(res, 'Error Charging Card.');
                    }

                    return res.redirect('/paymentSuccess');
                });
            }
        });
    });

});

module.exports = router;
