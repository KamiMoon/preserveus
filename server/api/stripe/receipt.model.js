'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//var validate = require('mongoose-validator');
var timestamps = require('mongoose-timestamp');

var ReceiptSchema = new Schema({
    user_id: String,
    user_name: String,
    email: String,
    stripeCustomerId: String,
    description: String,
    amount: Number,
    model: String,
    model_id: String,
    paymentSystem: String,
    confirmation: String,
    type: String
});


//TODO - refactor - this is becoming repetitive
ReceiptSchema.plugin(timestamps);

module.exports = mongoose.model('Receipt', ReceiptSchema);
