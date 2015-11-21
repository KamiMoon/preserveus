/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var mongoose = require('mongoose');
var User = require('../api/user/user.model');

console.log('Running seed.js');

mongoose.connection.collections['users'].drop(function() {
    User.create({
        provider: 'local',
        name: 'Test User',
        email: 'test@test.com',
        password: 'test',
        activated: true
    }, {
        provider: 'local',
        roles: [{
            role: 'admin'
        }],
        name: 'Admin',
        email: 'admin@admin.com',
        password: 'admin',
        activated: true
    }, function() {
        console.log('Populated users');
    });
});

console.log('DONE - Running seed.js');
