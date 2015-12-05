'use strict';

angular.module('preserveusApp')
    .controller('PropertyInvestmentCtrl', function($scope, $stateParams, PropertyService) {
        var action = $stateParams.action;
        var id = $stateParams.id;

        //in all cases a property must exist before adding
        PropertyService.get({
            id: id
        }).$promise.then(function(property) {
            $scope.property = property;
        });

        //it is always an update against an existing property or purely view mode

    });
