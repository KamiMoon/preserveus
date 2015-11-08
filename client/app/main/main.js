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
            }).state('privacy', {
                url: '/privacy',
                templateUrl: 'app/main/privacy.html'
            }).state('terms', {
                url: '/terms',
                templateUrl: 'app/main/terms.html'
            }).state('contact', {
                url: '/contact',
                templateUrl: 'app/main/contact.html',
                controller: 'ContactCtrl'
            }).state('services', {
                url: '/services',
                templateUrl: 'app/main/services.html'
            });
    });
