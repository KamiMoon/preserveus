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

    }).controller('UserProfileCtrl', function($scope, $stateParams, User) {
        var id = $stateParams.id;

        if (!id) {
            $scope.user = User.get();
        } else {
            $scope.user = User.profile({
                id: id
            });
        }


    });
