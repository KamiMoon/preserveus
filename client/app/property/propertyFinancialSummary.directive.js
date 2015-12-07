'use strict';

angular.module('preserveusApp')
    .directive('propertyFinancialSummary', function() {
        return {
            templateUrl: 'app/property/propertyFinancialSummary.html',
            restrict: 'E',
            scope: false,
            link: function postLink(scope, element, attrs) {

            }
        };
    });
