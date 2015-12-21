'use strict';

angular.module('preserveusApp')
    .controller('SettingsCtrl', function($scope, User, Auth, $location, ValidationService) {
        $scope.errors = {};

        $scope.changePassword = function(form) {
            $scope.submitted = true;
            if (form.$valid) {
                Auth.changePassword($scope.user.oldPassword, $scope.user.newPassword)
                    .then(function() {
                        ValidationService.success('Password successfully changed.');
                        $location.path('/profile/' + Auth.getCurrentUser()._id);
                    })
                    .catch(function() {
                        form.password.$setValidity('mongoose', false);
                        $scope.errors.other = 'Incorrect password';
                        $scope.message = '';
                    });
            }
        };
    });
