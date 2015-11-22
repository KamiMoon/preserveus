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
            }).state('properties', {
                url: '/properties',
                templateUrl: 'app/main/properties.html',
                controller: 'PropertiesCtrl'
            }).state('news', {
                url: '/news',
                templateUrl: 'app/main/news.html'
            }).state('notAuthorized', {
                url: '/notAuthorized',
                templateUrl: 'app/main/notAuthorized.html'
            }).state('thanks', {
                url: '/thanks',
                templateUrl: 'app/main/thanks.html'
            });
    });
