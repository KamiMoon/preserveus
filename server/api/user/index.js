'use strict';

var express = require('express');
var controller = require('./user.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');
var fileUtil = require('../../components/fileUtil');
var upload = fileUtil.getUpload();


var router = express.Router();

router.get('/', auth.hasRole('admin'), controller.index);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.get('/me', auth.isAuthenticated(), controller.me);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.put('/:id', upload.single('file'), controller.update);
router.post('/:id', upload.single('file'), controller.update);


router.get('/:id', auth.isAuthenticated(), controller.show);

router.post('/', controller.create);
router.get('/activate/:id/:activationHash', controller.activate);

router.get('/profile/:id', auth.isAuthenticated(), controller.show);

router.get('/:id/profile', controller.profile);


module.exports = router;
