'use strict';

var Listing = require('./listing.model');
var ControllerUtil = require('../../components/controllerUtil');

// Get list of events
exports.index = function(req, res) {
    ControllerUtil.find(req, res, Listing);
};

// Get a single event
exports.show = function(req, res) {
    Listing.findById(req.params.id).exec(function(err, event) {
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
    Listing.create(req.body, function(err, event) {
        if (err) {
            return ControllerUtil.handleError(res, err);
        }
        return res.status(201).json(event);
    });
};

// Updates an existing event in the DB.
exports.update = function(req, res) {
    ControllerUtil.update(req, res, Listing);
};

// Deletes a event from the DB.
exports.destroy = function(req, res) {
    Listing.findById(req.params.id, function(err, event) {
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
