'use strict';

var express = require('express');
var controller = require('./post.controller');

var router = express.Router();

router.get('/keywords', controller.keywords);
router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;
