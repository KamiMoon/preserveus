'use strict';

angular.module('preserveusApp')
    .config(function($stateProvider) {
        $stateProvider.state('propertyList', {
            url: '/property',
            templateUrl: 'app/property/propertyList.html',
            controller: 'PropertyCtrl'
        }).state('propertyAdd', {
            url: '/property/add',
            templateUrl: 'app/property/propertyAdd.html',
            controller: 'PropertyAddCtrl'
        }).state('propertyEdit', {
            url: '/property/edit/:id',
            templateUrl: 'app/property/propertyAdd.html',
            controller: 'PropertyEditCtrl'
        }).state('propertyView', {
            url: '/property/:id',
            templateUrl: 'app/property/propertyView.html',
            controller: 'PropertyViewCtrl'
        });
    });
