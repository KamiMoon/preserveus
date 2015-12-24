'use strict';

angular.module('preserveusApp')
    .controller('PropertyTotalReportCtrl', function($scope, $stateParams, PropertyService, ValidationService) {

        var id = $stateParams.id;

        PropertyService.getPropertyTotalReport({
            id: id
        }).$promise.then(function(totals) {
            $scope.totals = totals;
        }, function(err) {
            ValidationService.error(err);
        });

    });
