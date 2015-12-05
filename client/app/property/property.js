'use strict';

angular.module('preserveusApp')
    .config(function($stateProvider) {
        $stateProvider.state('propertyList', {
            url: '/property',
            templateUrl: 'app/property/propertyList.html',
            controller: 'PropertyCtrl'
        }).state('propertyAddEdit', {
            url: '/property/:action/:id',
            templateUrl: 'app/property/propertyAdd.html',
            controller: 'PropertyAddEditCtrl'
        }).state('propertyView', {
            url: '/property/:id',
            templateUrl: 'app/property/propertyView.html',
            controller: 'PropertyViewCtrl'
        }).state('propertyInvestment', {
            url: '/propertyInvestment/:action/:id',
            templateUrl: 'app/property/propertyInvestment.html',
            controller: 'PropertyInvestmentCtrl'
        });
    });
