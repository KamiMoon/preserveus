'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var validate = require('mongoose-validator');
//var timestamps = require('mongoose-timestamp');
//var uniqueValidator = require('mongoose-unique-validator');

var ListingSchema = new Schema({
    name: {
        type: String,
        required: 'A name is required',
        unique: true,
        validate: [
            validate({
                validator: 'isLength',
                arguments: [3, 100],
                message: 'Name should be between {ARGS[0]} and {ARGS[1]} characters'
            })
        ]
    },
    description: {
        type: String,
        validate: [
            validate({
                validator: 'isLength',
                arguments: [3, 200],
                message: 'Description should be between {ARGS[0]} and {ARGS[1]} characters'
            })
        ]
    },
    photo: {
        type: String
    },
    address: {
        type: String,
        validate: [
            validate({
                validator: 'isLength',
                arguments: [0, 50]
            })
        ]
    },
    city: {
        type: String,
        validate: [
            validate({
                validator: 'isLength',
                arguments: [0, 50]
            })
        ]
    },
    state: {
        type: String
    },
    zip: {
        type: String,
        validate: [
            validate({
                validator: 'isLength',
                arguments: [0, 16]
            })
        ]
    },
    beds: Number,
    baths: Number,
    sqft: Number,
    cost: Number,
    mortgage: Number,
    features: [],
    financialSummary: [],
    projectedReturnsByYear: [],
    //array of arrays
    photoRows: []

});

//TODO - refactor - this is becoming repetitive
//ListingSchema.plugin(timestamps);
//ListingSchema.plugin(uniqueValidator, {
//    message: 'Error, expected {PATH} to be unique.'
//});

module.exports = mongoose.model('Listing', ListingSchema);
