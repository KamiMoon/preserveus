'use strict';

angular.module('preserveusApp')
    .config(function($stateProvider) {
        $stateProvider
            .state('main', {
                url: '/',
                templateUrl: 'app/main/main.html',
                controller: 'MainCtrl'
            }).state('team', {
                url: '/team',
                templateUrl: 'app/main/team.html'
            });
    });
