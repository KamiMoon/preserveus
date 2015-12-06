'use strict';

angular.module('preserveusApp')
    .directive('propertyGraph', function() {
        return {
            templateUrl: 'app/property/propertyGraph.html',
            restrict: 'E',
            scope: {
                projectedReturnsByYear: '='
            },
            link: function postLink(scope, element, attrs) {

                var buildGraph = function() {
                    scope.series = ['S&P 500', 'Preserve US'];

                    scope.options = {
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

                    scope.colours = ['#0000FF', '#FF0000'];
                };

                buildGraph();

                scope.$watch('projectedReturnsByYear', function(newValue, oldValue) {
                    if (scope.projectedReturnsByYear) {
                        var returnData = scope.projectedReturnsByYear.map(function(obj) {
                            //TODO remove this
                            if (obj.text) {
                                return obj.text.toFixed(2);
                            } else {
                                return obj.toFixed(2);
                            }

                        });

                        var sp = [];
                        scope.labels = [];
                        for (var i = 0; i < returnData.length; i++) {
                            //TODO - flat S&P returns need to be configurable
                            sp.push(10000.00);

                            if (i === returnData.length - 1) {
                                scope.labels.push('Exit');
                            } else {
                                scope.labels.push('Year' + (i + 1));
                            }
                        }

                        scope.data = [
                            sp,
                            returnData
                        ];
                    }
                });
            }
        };
    });
