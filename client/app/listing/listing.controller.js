'use strict';

angular.module('preserveusApp')
    .controller('ListingCtrl', function($scope, ListingService, ValidationService) {

        $scope.listings = ListingService.query();


    }).controller('ListingAddCtrl', function($scope, $stateParams, $location, ListingService, ValidationService) {

        $scope.listing = {};

        $scope.save = function(form) {
            $scope.submitted = true;

            if (form.$valid) {
                ListingService.save($scope.listing).$promise.then(function(listing) {
                    ValidationService.success();
                    $location.path('/listing/view/' + listing._id);
                }, function(err) {
                    ValidationService.displayErrors(form, err);
                });
            }

        };

    }).controller('ListingEditCtrl', function($scope, $stateParams, $location, ListingService, ValidationService) {

        var id = $stateParams.id;

        $scope.listing = ListingService.get({
            id: id
        });

        $scope.save = function(form) {
            $scope.submitted = true;

            if (form.$valid) {
                ListingService.update({
                    id: $scope.listing._id
                }, $scope.listing).$promise.then(function() {
                    ValidationService.success();
                    $location.path('/listing/view/' + id);
                }, function(err) {
                    ValidationService.displayErrors(form, err);
                });
            }
        };

    }).controller('ListingViewCtrl', function($scope, $stateParams, Auth, ListingService) {

        var id = $stateParams.id;

        ListingService.get({
            id: id
        }).$promise.then(function(listing) {
            $scope.listing = listing;
        });

    });
