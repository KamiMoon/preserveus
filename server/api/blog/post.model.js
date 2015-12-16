'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var validate = require('mongoose-validator');
var timestamps = require('mongoose-timestamp');
var uniqueValidator = require('mongoose-unique-validator');
var TextUtil = require('../../components/textUtil');

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
    description: {
        type: String
    },
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
        required: 'A Summary is required',
        validate: [
            validate({
                validator: 'isLength',
                arguments: [3, 100],
                message: 'Summary should be between {ARGS[0]} and {ARGS[1]} characters'
            })
        ]

    },
    keywords: []
}, {
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }
});

PostSchema
    .pre('save', function(next) {
        if (!this.isNew) return next();

        if (!this.title) {
            next(new Error('Title is required.'));
        } else {
            this._id = TextUtil.slugify(this.title);
            next();
        }
    });

PostSchema
    .virtual('fullUrl')
    .get(function() {
        return 'https://www.preservedfw.com/blog/' + this._id;
    });


//TODO - refactor - this is becoming repetitive
PostSchema.plugin(timestamps);
PostSchema.plugin(uniqueValidator, {
    message: 'Error, expected {PATH} to be unique.'
});

module.exports = mongoose.model('Post', PostSchema);
