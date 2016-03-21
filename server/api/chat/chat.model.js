'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var timestamps = require('mongoose-timestamp');
var uniqueValidator = require('mongoose-unique-validator');
var ChatDetailSchema = require('./chatDetail.model');


//chat has an array of users - any such user can pull up this chat


var ChatSchema = new Schema({
    users: [],
    messages: []

});


//TODO - refactor - this is becoming repetitive
ChatSchema.plugin(timestamps);
ChatSchema.plugin(uniqueValidator, {
    message: 'Error, expected {PATH} to be unique.'
});

module.exports = mongoose.model('Chat', ChatSchema);
