/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var chat = require('./chat.model');

var socket = null;

exports.register = function(sock) {
    socket = sock;
};

exports.sendMessage = function(messageObj, cb) {

    console.log('sendMessage');
    console.log(messageObj);

    socket.emit('chatDetail:save', messageObj);
};

/*
function onSave(socket, doc, cb) {
    socket.emit('chatDetail:save', doc);
}

function onRemove(socket, doc, cb) {
    socket.emit('chatDetail:remove', doc);
}
*/
