'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var timestamps = require('mongoose-timestamp');

//chat has an array of users - any such user can pull up this chat


var ChatDetailSchema = new Schema({
    user_id: String,
    text: String
});


//TODO - refactor - this is becoming repetitive
ChatDetailSchema.plugin(timestamps);

module.exports = ChatDetailSchema;
