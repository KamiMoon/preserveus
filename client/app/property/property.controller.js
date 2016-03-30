'use strict';

angular.module('preserveusApp')
    .controller('PropertyCtrl', function($scope, PropertyService, uiGmapGoogleMapApi) {

        $scope.loaded = false;


        var buildMap = function() {
            if ($scope.properties.length) {

                var firstLocation = $scope.properties[0].geoLocation;

                $scope.map = {
                    center: {
                        latitude: firstLocation.lat,
                        longitude: firstLocation.lng
                    },
                    zoom: 14
                };



                $scope.mapMarkers = $scope.properties.map(function(property) {


                    var photo = '';

                    if (property.photo) {
                        photo = 'https://res.cloudinary.com/ddovrks1z/image/upload/w_100,h_100,c_fill/' + property.photo + '.jpg';
                    }

                    return {
                        latitude: property.geoLocation.lat,
                        longitude: property.geoLocation.lng,
                        id: property._id,
                        title: property.name,
                        show: false,
                        address: property.fullAddress,
                        description: property.description,
                        photo: photo
                    };
                });

                $scope.markerClick = function(marker, eventName, model) {
                    model.show = !model.show;
                };

                $scope.zoomToLocation = function(property) {
                    $scope.map = {
                        center: {
                            latitude: property.geoLocation.lat,
                            longitude: property.geoLocation.lng
                        },
                        zoom: 14
                    };

                    $('#mapTop')[0].scrollIntoView();
                };

                $scope.loaded = true;

            }
        };
      
        PropertyService.query().$promise.then(function(properties) {
            $scope.properties = properties;

            uiGmapGoogleMapApi.then(function(maps) {
                buildMap();
            });
        });


    }).controller('PropertyAddEditCtrl', function($scope, $stateParams, $location, PropertyService, ValidationService) {

        var action = $stateParams.action;
        var id = $stateParams.id;

        //features
        var createPropertyFeatureRow = function() {
            return [];
        };

        var setDefaultFeatures = function() {
            $scope.property.features = [];
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

        if (action === 'edit') {
            $scope.property = PropertyService.get({
                id: id
            });

            if (!$scope.features || !$scope.features.length) {
                setDefaultFeatures();
            }

        } else {
            //add
            $scope.property = {
                photos: []
            };

            //initialize defaults
            setDefaultFeatures();
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

    }).controller('PropertyViewCtrl', function($scope, $stateParams, SEOService, $location, Auth, PropertyService, ValidationService, ControllerUtil) {

        var id = $stateParams.id;

        PropertyService.get({
            id: id
        }).$promise.then(function(property) {
            $scope.property = property;
            //photoRows
            $scope.property.photoRows = _.chunk($scope.property.photos, 4);

            SEOService.setSEO({
                title: property.name,
                description: property.fullAddress,
                image: property.photo
            });
        });

        $scope.delete = function() {
            ControllerUtil.delete(id, PropertyService, '/property');
        };

    });
