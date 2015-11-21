'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var validate = require('mongoose-validator');
//var timestamps = require('mongoose-timestamp');
//var uniqueValidator = require('mongoose-unique-validator');

var PostSchema = new Schema({
    title: {
        type: String,
        required: 'A title is required',
        unique: true,
        validate: [
            validate({
                validator: 'isLength',
                arguments: [3, 100],
                message: 'Title should be between {ARGS[0]} and {ARGS[1]} characters'
            })
        ]
    },
    description: {
        type: String
    },
    link: {
        type: String
    },

    // author: {
    //     type: String,
    //     required: 'An author is required'
    // },
    postHtml: {
        type: String,
        required: 'A post body is required'
    },
    photo: {
        type: String
    }
});

//TODO - refactor - this is becoming repetitive
//PostSchema.plugin(timestamps);
//PostSchema.plugin(uniqueValidator, {
//    message: 'Error, expected {PATH} to be unique.'
//});

module.exports = mongoose.model('Post', PostSchema);
