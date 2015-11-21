'use strict';

angular.module('preserveusApp')
    .controller('PostCtrl', function($scope, PostService, ValidationService) {

        $scope.posts = PostService.query();


    }).controller('PostAddCtrl', function($scope, $stateParams, $location, PostService, ValidationService) {

        $scope.post = {};

        $scope.save = function(form) {
            $scope.submitted = true;

            if (form.$valid) {
                PostService.save($scope.post).$promise.then(function(post) {
                    ValidationService.success();
                    $location.path('/post/view/' + post._id);
                }, function(err) {
                    ValidationService.displayErrors(form, err);
                });
            }

        };

    }).controller('PostEditCtrl', function($scope, $stateParams, $location, PostService, ValidationService) {

        var id = $stateParams.id;

        $scope.post = PostService.get({
            id: id
        });

        $scope.save = function(form) {
            $scope.submitted = true;

            if (form.$valid) {
                PostService.update({
                    id: $scope.post._id
                }, $scope.post).$promise.then(function() {
                    ValidationService.success();
                    $location.path('/post/view/' + id);
                }, function(err) {
                    ValidationService.displayErrors(form, err);
                });
            }
        };

    }).controller('PostViewCtrl', function($scope, $stateParams, Auth, PostService) {

        var id = $stateParams.id;

        PostService.get({
            id: id
        }).$promise.then(function(post) {
            $scope.post = post;
        });

    });
