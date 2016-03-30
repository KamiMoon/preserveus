/**
 * Broadcast updates to client when the model changes
 */

'use strict';

//var chat = require('./chat.model');

var AppEvents = require('../../components/events');




exports.register = function(socket) {

    console.log('registering a socket');

    AppEvents.on('chatDetail:save', function(messageObj) {
        chatDetailSave(socket, messageObj, null);
    });
};
/*
function onSave(socket, doc, cb) {
    socket.emit('chatDetail:save', doc);
}

function onRemove(socket, doc, cb) {
    socket.emit('chatDetail:remove', doc);
}
*/


function chatDetailSave(socket, doc, cb) {
    console.log('received event - chatDetail:save');

    socket.emit('chatDetail:save', doc);
}
