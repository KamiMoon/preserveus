'use strict';

angular.module('preserveusApp')
    .config(function($stateProvider) {
        $stateProvider
            .state('userList', {
                url: '/user',
                templateUrl: 'app/user/userList.html',
                controller: 'UserCtrl',
                roles: ['admin']
            }).state('userEdit', {
                url: '/user/edit/:id',
                templateUrl: 'app/user/userEdit.html',
                controller: 'UserEditCtrl',
            }).state('userView', {
                url: '/profile/:id',
                templateUrl: 'app/user/profile.html',
                controller: 'UserProfileCtrl'
            });
    });
