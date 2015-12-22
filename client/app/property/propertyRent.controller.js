'use strict';

angular.module('preserveusApp')
    .controller('PropertyRentCtrl', function($scope, $stateParams, $location, PropertyService, ValidationService, PropertyInvestmentService, Auth) {
        var id = $stateParams.id;

        PropertyService.get({
            id: id
        }).$promise.then(function(property) {
            $scope.property = property;
            //photoRows
        });



    });
