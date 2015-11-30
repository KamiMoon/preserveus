'use strict';

angular.module('preserveusApp')
    .controller('PropertyInvestmentCtrl', function($scope, $stateParams, PropertyService) {

        var id = $stateParams.id;
        /*
                PropertyService.get({
                    id: id
                }).$promise.then(function(property) {
                    $scope.property = property;
                });
        */
        $scope.property = {};

        $scope.labels = ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'];
        $scope.series = ['S&P 500', 'Preserve US'];
        $scope.data = [
            [10000.00, 10000.00, 10000.00, 10000.00, 10000.00],
            [1777.00, 1777.00, 11545.00, 11545.00, 201541.82]
        ];

        $scope.options = {
            scaleBeginAtZero: true,
            scaleLabel: function(label) {
                return '$' + label.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            },
            tooltipTemplate: function(label) {
                return '$' + label.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            },
            multiTooltipTemplate: function(label) {
                return '$' + label.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
        };

        $scope.colours = ['#0000FF', '#FF0000'];

    });
