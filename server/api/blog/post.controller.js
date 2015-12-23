'use strict';

var Post = require('./post.model');
var ControllerUtil = require('../../components/controllerUtil');


exports.keywords = function(req, res) {

    var aggregationPipeline = [{
        '$unwind': '$keywords'
    }];

    if (req.query.search) {
        aggregationPipeline.push({
            '$match': {
                'keywords.text': {
                    '$regex': req.query.search
                }
            }
        });
    }

    aggregationPipeline.push({
        '$group': {
            '_id': '$keywords.text'
        }
    }, {
        '$sort': {
            '_id': 1
        }
    });

    Post.aggregate(aggregationPipeline).exec(function(err, keywords) {
        if (err) {
            return ControllerUtil.handleError(res, err);
        }
        return res.json(keywords);
    });
};

// Get list of events
exports.index = function(req, res) {
    ControllerUtil.find(req, res, Post, {}, {
        'createdAt': -1
    });
};

// Get a single event
exports.show = function(req, res) {
    Post.findById(req.params.id).exec(function(err, event) {
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
    ControllerUtil.create(req, res, Post, 'photo');
};

// Updates an existing event in the DB.
exports.update = function(req, res) {
    ControllerUtil.update(req, res, Post);
};

// Deletes a event from the DB.
exports.destroy = function(req, res) {
    Post.findById(req.params.id, function(err, event) {
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
