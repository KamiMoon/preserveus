'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var validate = require('mongoose-validator');
var timestamps = require('mongoose-timestamp');
var uniqueValidator = require('mongoose-unique-validator');
var TextUtil = require('../../components/textUtil');
var config = require('../../config/environment');


var PropertySchema = new Schema({
    _id: String,

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
    photoRows: [],
    totalRenters: Number,
    totalRentersAvailable: Number,
    allowRent: {
        type: Boolean,
        default: true
    },
    allowInvest: {
        type: Boolean,
        default: true
    },
    minimumInvestmentAmount: Number,
    maximumInvestmentAmount: Number,
    geoLocation: {}

});

//TODO - refactor - this is becoming repetitive
PropertySchema.plugin(timestamps);
PropertySchema.plugin(uniqueValidator, {
    message: 'Error, expected {PATH} to be unique.'
});

var setGeolocation = function(context, next) {
    var geocodeParams = {
        'address': context.address + ' ' + context.city + ', ' + context.state + ' ' + context.zip
    };

    //TODO - optimize by only calling this is address etc changed
    config.googleMapsApi.geocode(geocodeParams, function(err, result) {
        console.log('ran geolocation');
        if (err) {
            next(new Error('Not a valid address to on Google'));
        }

        var geoLocation = result.results[0].geometry.location;
        context.geoLocation = geoLocation;

        next();

    });

};

PropertySchema
    .pre('save', function(next) {
        if (!this.isNew) {

            setGeolocation(this, next);

        } else {
            if (!this.name) {
                next(new Error('Name is required.'));
            } else {
                this._id = TextUtil.slugify(this.name);

                setGeolocation(this, next);
            }
        }

    });

module.exports = mongoose.model('Property', PropertySchema);
