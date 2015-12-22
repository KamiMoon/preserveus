// Set your secret key: remember to change this to your live secret key in production
// See your keys here https://dashboard.stripe.com/account/apikeys
var stripe = require('stripe')('sk_test_hdEpFYjqCu8t9QHg1DwXdCta');
var EmailUtil = require('../../components/emailUtil');
var Receipt = require('./receipt.model');

function chargeCustomer(receipt, callback) {
    var amountCents = Math.round(receipt.amount * 100) / 100 * 100;

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

exports.chargeCustomer = function(stripeToken, user, receipt, callback) {
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
                    return callback('Error Charging Card.');
                }

                user.stripeCustomerId = receipt.stripeCustomerId;
                //save customerId on the user
                user.save(function(err) {
                    if (err) return callback(err);

                    return callback(err, 'success');
                });
            });
        });

    } else {
        //customer already exists - just recharge to them
        receipt.stripeCustomerId = user.stripeCustomerId;

        console.log('Existing Customer: ' + receipt.stripeCustomerId);

        chargeCustomer(receipt, function(err, charge) {
            if (err) {
                return callback('Error Charging Card.');
            }

            return callback(err, 'success');
        });
    }

}
