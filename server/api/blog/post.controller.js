'use strict';

var Post = require('./post.model');
var ControllerUtil = require('../../components/controllerUtil');
var config = require('../../config/environment');


// Get list of events
exports.index = function(req, res) {
    ControllerUtil.find(req, res, Post);
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
    ControllerUtil.createWithPhoto(req, res, Post, 'photo');
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

exports.uploadTest = function(req, res) {
    config.cloudinary.uploader.upload('http://www.online-image-editor.com//styles/2014/images/example_image.png', function(result) {
        console.log(result);
        res.json('hi');

    });


};
