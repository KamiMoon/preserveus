/**
 * Broadcast updates to client when the model changes
 */

'use strict';

exports.register = function(io, socket) {
    socket.on('chatDetail:save', function(messageObj) {
        io.emit('chatDetail:save', messageObj);
    });
};
