'use strict';

var express = require('express');
var controller = require('./property.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/propertyTotalReport', auth.hasRole('admin'), controller.propertyTotalReport);
router.get('/propertyIncomeReport/:id', auth.hasRole('admin'), controller.propertyIncomeReport);
router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', auth.hasRole('admin'), controller.create);
router.put('/:id', auth.hasRole('admin'), controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);

module.exports = router;
