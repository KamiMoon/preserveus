'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var validate = require('mongoose-validator');
var timestamps = require('mongoose-timestamp');
var uniqueValidator = require('mongoose-unique-validator');

var PostSchema = new Schema({
    _id: String,
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
    slug: {
        type: String,
        required: 'A slug is required.',
        unique: true
    },

    description: {
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
    },
    user_id: Schema.Types.ObjectId,
    user_name: String,
    headingQuote: {
        type: String,
        validate: [
            validate({
                validator: 'isLength',
                arguments: [3, 500],
                message: 'Title should be between {ARGS[0]} and {ARGS[1]} characters'
            })
        ]
    },
    keywords: []
});

PostSchema
    .pre('save', function(next) {
        if (!this.isNew) return next();

        if (!this.slug) {
            next(new Error('Slug is required.'));
        } else {
            this._id = this.slug;
            next();
        }
    });

//TODO - refactor - this is becoming repetitive
PostSchema.plugin(timestamps);
PostSchema.plugin(uniqueValidator, {
    message: 'Error, expected {PATH} to be unique.'
});

module.exports = mongoose.model('Post', PostSchema);
