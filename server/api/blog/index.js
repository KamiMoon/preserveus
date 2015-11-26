'use strict';

var express = require('express');
var controller = require('./post.controller');
var fileUtil = require('../../components/fileUtil');

var upload = fileUtil.getUpload();

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', upload.single('file'), controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;