'use strict';

var async = require('async');
var Chat = require('./chat.model');
var User = require('../user/user.model');
var ControllerUtil = require('../../components/controllerUtil');
var AppEvents = require('../../components/events');

// Get list of chats
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

    Chat.find({
        'users': {
            '$elemMatch': {
                'user_id': req.params.user_id,
                'deleted': false
            }
        }
    }).exec(function (err, chats) {
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

// Updates an existing chat in the DB.
exports.update = function(req, res) {
    ControllerUtil.update(req, res, Chat);
};

// Deletes a chat from the DB.
exports.destroy = function(req, res) {
    Chat.findById(req.params.id, function(err, chat) {
        if (err) {
            return ControllerUtil.handleError(res, err);
        }
        if (!chat) {
            return res.status(404).send('Not Found');
        }
        chat.remove(function(err) {
            if (err) {
                return ControllerUtil.handleError(res, err);
            }
            return res.status(204).send('No Content');
        });
    });
};

exports.sendMessage = function(req, res) {
    var body = req.body;
    var chatId = body.chatId;
    var messageObj = body.messageObj;

    if (!chatId && !messageObj) {
        return ControllerUtil.handleError(res, 'Invalid message');
    }

    //find the existing chat
    Chat.findById(chatId, function(err, chat) {
        if (err) {
            return ControllerUtil.handleError(res, err);
        }
        if (!chat) {
            return res.status(404).send('Not Found');
        }

        chat.messages.push(messageObj);

        chat.save(function(err, chat) {
            if (err) {
                return ControllerUtil.handleError(res, err);
            }

            console.log('emitting chatDetail:save');

            AppEvents.emit('chatDetail:save', {
                chatId: chatId,
                messageObj: chat.messages[chat.messages.length - 1]
            });

            res.status(200).send('OK');
        });

    });

};


exports.markChatDeletedForUser = function (req, res) {
    var chatId = req.params.id;
    var userId = req.params.user_id;

    Chat.findById(chatId, function (err, chat) {
        if (err) {
            return ControllerUtil.handleError(res, err);
        }

        //find the user on this chat
        for (var i = 0; i < chat.users.length; i++) {
            var user = chat.users[i];

            if (user.user_id === userId) {
                chat.users[i].deleted = true;
                chat.markModified('users');
                break;
            }
        }

        chat.save(function (err, chat) {
            if (err) {
                return ControllerUtil.handleError(res, err);
            }

            console.log('successfully marked chat ' + chatId + ' deleted for user  ' + userId);

            res.status(200).send('OK');
        });

    });
};
