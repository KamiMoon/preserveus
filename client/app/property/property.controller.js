'use strict';

angular.module('preserveusApp')
    .controller('PropertyCtrl', function($scope, PropertyService, ValidationService) {

        $scope.properties = PropertyService.query();

    }).controller('PropertyAddEditCtrl', function($scope, $stateParams, $location, PropertyService, ValidationService) {

        var action = $stateParams.action;
        var id = $stateParams.id;

        //features
        var createPropertyFeatureRow = function() {
            return [{
                text: ''
            }, {
                text: ''
            }, {
                text: ''
            }];
        };

        var setDefaultFeatures = function() {
            $scope.property.features = [createPropertyFeatureRow(), createPropertyFeatureRow(), createPropertyFeatureRow()];
        };

        $scope.featureToAddRow = createPropertyFeatureRow();

        $scope.deleteFeature = function(feature) {
            for (var i = 0; i < $scope.property.features.length; i++) {
                if ($scope.property.features[i].$$hashKey === feature.$$hashKey) {
                    $scope.property.features.splice(i, 1);
                    break;
                }
            }
        };

        $scope.addMoreFeatures = function() {
            $scope.property.features.push($scope.featureToAddRow);

            $scope.featureToAddRow = createPropertyFeatureRow();
        };

        //financial summary
        var createFinancialFact = function() {
            return {
                text: ''
            };
        };

        var setDefaultFinancialSummary = function() {
            $scope.property.financialSummary = [createFinancialFact(), createFinancialFact(), createFinancialFact()];

        };

        $scope.financialFactToAdd = createFinancialFact();


        $scope.deleteFinancialFact = function(feature) {
            for (var i = 0; i < $scope.property.financialSummary.length; i++) {
                if ($scope.property.financialSummary[i].$$hashKey === feature.$$hashKey) {
                    $scope.property.financialSummary.splice(i, 1);
                    break;
                }
            }
        };

        $scope.addFinancialFact = function() {
            $scope.property.financialSummary.push($scope.financialFactToAdd);

            $scope.financialFactToAdd = createFinancialFact();
        };

        //projected returns
        var createProjectionItem = function() {
            return {
                text: ''
            };
        };

        var setDefaultProjectedReturns = function() {
            $scope.property.projectedReturnsByYear = [createProjectionItem(), createProjectionItem(), createProjectionItem(), createProjectionItem(), createProjectionItem(), createProjectionItem()];
        };

        $scope.projectionItemToAdd = createProjectionItem();


        $scope.deleteProjectionItem = function(feature) {
            for (var i = 0; i < $scope.property.projectedReturnsByYear.length; i++) {
                if ($scope.property.projectedReturnsByYear[i].$$hashKey === feature.$$hashKey) {
                    $scope.property.projectedReturnsByYear.splice(i, 1);
                    break;
                }
            }
        };

        $scope.addProjectionItem = function() {
            $scope.property.projectedReturnsByYear.push($scope.projectionItemToAdd);

            $scope.projectionItemToAdd = createProjectionItem();
        };

        if (action === 'edit') {
            $scope.property = PropertyService.get({
                id: id
            });

            if (!$scope.features || !$scope.features.length) {
                setDefaultFeatures();
            }

            if (!$scope.financialSummary || !$scope.financialSummary.length) {
                setDefaultFinancialSummary();
            }

            if (!$scope.projectedReturnsByYear || !$scope.projectedReturnsByYear.length) {
                setDefaultProjectedReturns();
            }

        } else {
            //add
            $scope.property = {};

            //initialize defaults
            setDefaultFeatures();
            setDefaultFinancialSummary();
            setDefaultProjectedReturns();
        }

        $scope.save = function(form) {
            $scope.submitted = true;

            if (form.$valid) {

                if (action === 'edit') {
                    PropertyService.update({
                        id: $scope.property._id
                    }, $scope.property).$promise.then(function() {
                        ValidationService.success();
                        $location.path('/property/' + id);
                    }, function(err) {
                        ValidationService.displayErrors(form, err);
                    });
                } else {
                    //add
                    PropertyService.save($scope.property).$promise.then(function(property) {
                        ValidationService.success();
                        $location.path('/property/' + property._id);
                    }, function(err) {
                        ValidationService.displayErrors(form, err);
                    });

                }

            }

        };

    }).controller('PropertyViewCtrl', function($scope, $stateParams, $location, Auth, PropertyService, ValidationService) {

        var id = $stateParams.id;

        var createGraph = function() {
            $scope.labels = ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Exit'];
            $scope.series = ['S&P 500', 'Preserve US'];
            $scope.options = {
                scaleBeginAtZero: true
            };

            if ($scope.property.projectedReturnsByYear) {
                var returnData = $scope.property.projectedReturnsByYear.map(function(obj) {
                    return obj.text;
                });

                var sp = [];
                for (var i = 0; i < returnData.length; i++) {
                    sp.push(10.00);
                }

                $scope.data = [
                    sp,
                    returnData
                ];
            } else {
                $scope.data = [
                    [10.00, 10.00, 10.00, 10.00, 10.00, 10.00],
                    [10.00, 10.00, 11.00, 13.90, 14.80, 24.20]

                ];
            }


            $scope.colours = ['#0000FF', '#FF0000'];
            $scope.onClick = function(points, evt) {
                console.log(points, evt);
            };

        };

        PropertyService.get({
            id: id
        }).$promise.then(function(property) {
            $scope.property = property;
            createGraph();
        });

        $scope.delete = function(id) {
            if (id) {

                var r = confirm('Are you sure you want to delete?');
                if (r == true) {
                    PropertyService.delete({
                        id: id
                    }).$promise.then(function() {
                        ValidationService.success('Post deleted.');

                        $location.path('/property');

                    }, function() {
                        ValidationService.error('Delete Failed');
                    });
                }

            }
        };

    });
