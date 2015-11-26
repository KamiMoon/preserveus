'use strict';

angular.module('preserveusApp')
    .controller('PropertyCtrl', function($scope, PropertyService, ValidationService) {

        $scope.properties = PropertyService.query();

        $scope.delete = function(id) {
            if (id) {

                var r = confirm('Are you sure you want to delete?');
                if (r == true) {
                    PropertyService.delete({
                        id: id
                    }).$promise.then(function() {
                        ValidationService.success();

                        angular.forEach($scope.properties, function(obj, i) {
                            if (obj._id === id) {
                                $scope.properties.splice(i, 1);
                            }
                        });

                    }, function() {
                        ValidationService.error('Delete Failed');
                    });
                }

            }
        };

    }).controller('PropertyAddCtrl', function($scope, $stateParams, $location, PropertyService, ValidationService) {

        var createPropertyFeatureRow = function() {
            return [{
                text: ''
            }, {
                text: ''
            }, {
                text: ''
            }];
        };

        $scope.featureToAddRow = createPropertyFeatureRow();

        $scope.property = {
            features: [createPropertyFeatureRow(), createPropertyFeatureRow(), createPropertyFeatureRow()]
        };

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

        $scope.save = function(form) {
            $scope.submitted = true;

            if (form.$valid) {
                PropertyService.save($scope.property).$promise.then(function(property) {
                    ValidationService.success();
                    $location.path('/property/' + property._id);
                }, function(err) {
                    ValidationService.displayErrors(form, err);
                });
            }

        };

    }).controller('PropertyEditCtrl', function($scope, $stateParams, $location, PropertyService, ValidationService) {

        var id = $stateParams.id;

        $scope.property = PropertyService.get({
            id: id
        });

        var createPropertyFeatureRow = function() {
            return [{
                text: ''
            }, {
                text: ''
            }, {
                text: ''
            }];
        };

        $scope.featureToAddRow = createPropertyFeatureRow();

        if (!$scope.features || !$scope.features.length) {
            $scope.features = [createPropertyFeatureRow(), createPropertyFeatureRow(), createPropertyFeatureRow()];
        }

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

        $scope.save = function(form) {
            $scope.submitted = true;

            if (form.$valid) {
                PropertyService.update({
                    id: $scope.property._id
                }, $scope.property).$promise.then(function() {
                    ValidationService.success();
                    $location.path('/property/' + id);
                }, function(err) {
                    ValidationService.displayErrors(form, err);
                });
            }
        };

    }).controller('PropertyViewCtrl', function($scope, $stateParams, $location, Auth, PropertyService, ValidationService) {

        var id = $stateParams.id;

        PropertyService.get({
            id: id
        }).$promise.then(function(property) {
            $scope.property = property;
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
