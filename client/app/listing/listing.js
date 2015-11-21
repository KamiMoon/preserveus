'use strict';

angular.module('preserveusApp')
    .config(function($stateProvider) {
        $stateProvider.state('listingList', {
            url: '/listing',
            templateUrl: 'app/listing/listingList.html',
            controller: 'ListingCtrl'
        }).state('listingAdd', {
            url: '/listing/add',
            templateUrl: 'app/listing/listingAdd.html',
            controller: 'ListingAddCtrl'
        }).state('listingEdit', {
            url: '/listing/edit/:id',
            templateUrl: 'app/listing/listingAdd.html',
            controller: 'ListingEditCtrl'
        }).state('listingView', {
            url: '/listing/view/:id',
            templateUrl: 'app/listing/listingView.html',
            controller: 'ListingViewCtrl'
        });
    });
