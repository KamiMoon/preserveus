'use strict';

var express = require('express');
var controller = require('./thing.controller');
var cors = require('cors');

var router = express.Router();

var corsOptions = {
    origin: 'https://www.preservedfw.com'
};


router.get('/', cors(corsOptions), controller.index);
router.get('/:id', cors(corsOptions), controller.show);
router.post('/', cors(corsOptions), controller.create);
router.put('/:id', cors(corsOptions), controller.update);
router.patch('/:id', cors(corsOptions), controller.update);
router.delete('/:id', cors(corsOptions), controller.destroy);

router.options('/', cors(corsOptions));
router.options('/:id', cors(corsOptions));

module.exports = router;
