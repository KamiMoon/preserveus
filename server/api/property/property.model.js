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
                    arguments: [3, 1000],
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
        //new
        units: Number,
        garages: Number,

        sqft: Number,
        cost: Number,
        mortgage: Number,
        features: [],
        financialSummary: [],
        projectedReturnsByYear: [],
        //array of arrays
        photos: [],
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
        geoLocation: {},
        //investment info

        pricePerSqft: Number,
        equityInvested: Number,
        equityInvestedPercent: Number,
        debtHeld: Number,
        avgCompSalePrice: Number,
        monthlyRentalRevenue: Number,
        projectedMonthlyRentalRevenue: Number,
        currentRentalRevenue: Number,
        projectedRentalRevenue: Number,
        mortgagePrinciple: Number,
        taxes: Number,
        insurance: Number,
        monthlyRemodelExpense: Number,
        monthlyManagementFee: Number,
        totalCost: Number,
        projectedManagementFee: Number,
        currentMonthlyProfit: Number,
        projectedMonthlyProfit: Number,
        currentYearlyProfit: Number,
        projectedYearlyProfit: Number,
        yearsToHold: Number,
        totalValueToAdd: Number,
        projectedAmountOfDebt: Number,
        projectedProfitAtFinal: Number,
        exitTotal: Number,
        finalTotal: Number,
        returnOnInvestmentPercent: Number,
        avgReturnPerYear: Number,
        irr: Number,
        netPresentValue: Number
    }, {
        toObject: {
            virtuals: true
        },
        toJSON: {
            virtuals: true
        }
    }

);

//TODO - refactor - this is becoming repetitive
PropertySchema.plugin(timestamps);
PropertySchema.plugin(uniqueValidator, {
    message: 'Error, expected {PATH} to be unique.'
});

PropertySchema
    .virtual('fullAddress')
    .get(function() {
        return this.address + ' ' + this.city + ', ' + this.state + ' ' + this.zip;
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

PropertySchema.set('versionKey', false);


module.exports = mongoose.model('Property', PropertySchema);
