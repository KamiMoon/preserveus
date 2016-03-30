'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var timestamps = require('mongoose-timestamp');

//chat has an array of users - any such user can pull up this chat

var ChatUserSchema = new Schema({
    user_id: String,
    deleted: {
        type: Boolean,
        default: false
    }
});

//TODO - refactor - this is becoming repetitive
ChatUserSchema.plugin(timestamps);

module.exports = ChatUserSchema;
