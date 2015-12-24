'use strict';

angular.module('preserveusApp')
    .controller('PropertyIncomeReportCtrl', function($scope, $stateParams, PropertyService, ValidationService) {

        var id = $stateParams.id;

        PropertyService.getIncomeReport({
            id: id
        }).$promise.then(function(property) {
            $scope.property = property;
        }, function(err) {
            ValidationService.error(err);
        });

    });
