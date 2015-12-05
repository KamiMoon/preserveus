'use strict';

angular.module('preserveusApp')
    .controller('PropertyInvestmentCtrl', function($scope, $stateParams, PropertyService) {
        var action = $stateParams.action;
        var id = $stateParams.id;

        if (action === 'view' || action === 'edit') {
            PropertyService.get({
                id: id
            }).$promise.then(function(property) {
                $scope.property = property;
            });
        } else {

        }

    });
