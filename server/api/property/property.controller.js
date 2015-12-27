'use strict';

var Property = require('./property.model');
var ControllerUtil = require('../../components/controllerUtil');
var ReceiptService = require('../stripe/receipt.service');

exports.propertyTotalReport = function(req, res) {

    var totals = {};

    ReceiptService.getTotalReceiptsByType('Investment', function(err, investmentTotals) {
        if (err) {
            return ControllerUtil.handleError(res, err);
        }

        totals.investmentTotals = investmentTotals;

        ReceiptService.getTotalReceiptsByType('Rent', function(err, rentTotals) {
            if (err) {
                return ControllerUtil.handleError(res, err);
            }

            totals.rentTotals = rentTotals;

            res.json(totals);
        });
    });
};

exports.propertyIncomeReport = function(req, res) {
    Property.findById(req.params.id).lean().exec(function(err, property) {
        if (err) {
            return ControllerUtil.handleError(res, err);
        }
        if (!property) {
            return res.status(404).send('Not Found');
        }

        ReceiptService.getTotalReceiptsByProperty(property._id, function(err, result) {
            if (err) {
                return ControllerUtil.handleError(res, err);
            }

            property.receipts = result.receipts;
            property.receiptsTotal = result.receiptsTotal;
            property.rentalPayments = result.rentalPayments;
            property.rentalPaymentsTotal = result.rentalPaymentsTotal;

            res.json(property);
        });
    });
};

// Get list of events
exports.index = function(req, res) {
    ControllerUtil.find(req, res, Property);
};

// Get a single event
exports.show = function(req, res) {
    Property.findById(req.params.id).exec(function(err, event) {
        if (err) {
            return ControllerUtil.handleError(res, err);
        }
        if (!event) {
            return res.status(404).send('Not Found');
        }
        return res.json(event);
    });
};

// Creates a new event in the DB.
exports.create = function(req, res) {
    Property.create(req.body, function(err, event) {
        if (err) {
            return ControllerUtil.handleError(res, err);
        }
        return res.status(201).json(event);
    });
};

// Updates an existing event in the DB.
exports.update = function(req, res) {
    ControllerUtil.update(req, res, Property);
};

// Deletes a event from the DB.
exports.destroy = function(req, res) {
    Property.findById(req.params.id, function(err, event) {
        if (err) {
            return ControllerUtil.handleError(res, err);
        }
        if (!event) {
            return res.status(404).send('Not Found');
        }
        event.remove(function(err) {
            if (err) {
                return ControllerUtil.handleError(res, err);
            }
            return res.status(204).send('No Content');
        });
    });
};
