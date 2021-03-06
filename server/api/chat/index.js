'use strict';

var express = require('express');
var controller = require('./chat.controller');

var router = express.Router();

router.get('/foruser/:user_id', controller.getChatsForUser);
router.get('/detail/:id', controller.getChatDetail);

router.post('/create', controller.create);
router.post('/sendMessage', controller.sendMessage);

router.put('/markChatDeletedForUser/:id/:user_id', controller.markChatDeletedForUser);

module.exports = router;
