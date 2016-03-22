'use strict';

var async = require('async');
var Chat = require('./chat.model');
var User = require('../user/user.model');
var ControllerUtil = require('../../components/controllerUtil');


// Get list of events
exports.index = function(req, res) {
    ControllerUtil.find(req, res, Chat);
};

function populateChat(chat, showAllMesssages, cb) {

    async.map(chat.users, function(user, cb) {
        User.findById(user.user_id, function(err, user) {
            if (err) {
                cb(err);
            }
            cb(null, {
                user_id: user._id,
                name: user.name,
                photo: user.photo
            });
        });

    }, function(err, users) {
        if (err) {
            cb(err);
        }

        var chatObj = {
            _id: chat._id,
            users: users
        };

        if (showAllMesssages) {
            chatObj.messages = chat.messages;
        } else {
            var lastMessage = chat.messages[chat.messages.length - 1];

            if (lastMessage) {
                chatObj.lastMessage = lastMessage.text;
            }
        }

        return cb(null, chatObj);
    });

}


exports.getChatsForUser = function(req, res) {
    Chat.find({ 'users.user_id': req.params.user_id }).exec(function(err, chats) {
        if (err) {
            return ControllerUtil.handleError(res, err);
        }

        async.map(chats, function(chat, cb) {
            populateChat(chat, false, function(err, populatedChat) {
                if (err) {
                    cb(err);
                }
                cb(null, populatedChat);
            });
        }, function(err, populatedChats) {
            if (err) {
                return ControllerUtil.handleError(res, err);
            }
            return res.status(201).json(populatedChats);
        });
    });
};

exports.getChatDetail = function(req, res) {
    Chat.findById(req.params.id, function(err, chat) {
        if (err) {
            return ControllerUtil.handleError(res, err);
        }

        populateChat(chat, true, function(err, populatedChat) {
            if (err) {
                return ControllerUtil.handleError(res, err);
            }
            return res.status(201).json(populatedChat);
        });
    });
};

exports.create = function(req, res) {

    console.log('create');
    console.log(req.body);

    Chat.create(req.body, function(err, chat) {
        if (err) {
            return ControllerUtil.handleError(res, err);
        }

        console.log(chat);

        populateChat(chat, true, function(err, populatedChat) {
            if (err) {
                return ControllerUtil.handleError(res, err);
            }
            return res.status(201).json(populatedChat);
        });
    });
};

// Updates an existing event in the DB.
exports.update = function(req, res) {
    ControllerUtil.update(req, res, Chat);
};

// Deletes a event from the DB.
exports.destroy = function(req, res) {
    Chat.findById(req.params.id, function(err, event) {
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
