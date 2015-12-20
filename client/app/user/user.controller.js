'use strict';

angular.module('preserveusApp')
    .controller('UserCtrl', function($scope, User, ValidationService, ControllerUtil) {

        $scope.users = User.query();

        $scope.searchParams = {};

        $scope.search = function() {

            $scope.users = User.query($scope.searchParams);

        };

        $scope.delete = function(id) {
            if (id) {

                var r = confirm('Are you sure you want to delete?');
                if (r == true) {
                    User.delete({
                        id: id
                    }).$promise.then(function() {
                        ValidationService.success();

                        angular.forEach($scope.users, function(obj, i) {
                            if (obj._id === id) {
                                $scope.users.splice(i, 1);
                            }
                        });

                    }, function() {
                        ValidationService.error('Delete Failed');
                    });
                }

            }
        };

    }).controller('UserEditCtrl', function($scope, $location, $stateParams, User, ControllerUtil) {
        var id = $stateParams.id;

        $scope.user = User.profile({
            id: id
        });

        $scope.save = function(form) {

            if (ControllerUtil.validate($scope, form)) {

                var request = User.update({
                    id: id
                }, $scope.user).$promise;

                ControllerUtil.handle(request, form).then(function() {
                    $location.path('/profile/' + id);
                });
            }

        };

    }).controller('UserProfileCtrl', function($scope, $stateParams, User, ValidationService) {
        var id = $stateParams.id;

        if (!id) {
            User.get().$promise.then(function(user) {
                $scope.user = user;
                showMessageToFillOutProfile(user);
            });
        } else {
            User.profile({
                id: id
            }).$promise.then(function(user) {
                $scope.user = user;
                showMessageToFillOutProfile(user);
            });
        }

        var showMessageToFillOutProfile = function(user) {
            if (!user.name) {
                ValidationService.info("Your profile has not been filled out.  Click 'Edit' to complete your profile.");
            }
        };



    });
