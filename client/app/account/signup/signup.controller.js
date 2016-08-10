'use strict';

angular.module('preserveusApp')
    .controller('SignupCtrl', function($scope, Auth, $location, $window, ValidationService, vcRecaptchaService) {
        $scope.user = {};

        $scope.response = null;
        $scope.widgetId = null;
        $scope.model = {
            key: '6Lf16R4TAAAAACGBXlRPtcE3dmcztUOG1ti2QDn5'
        };
        $scope.setResponse = function(response) {
            console.info('Response available');
            $scope.response = response;
        };
        $scope.setWidgetId = function(widgetId) {
            console.info('Created widget ID: %s', widgetId);
            $scope.widgetId = widgetId;
        };
        $scope.cbExpiration = function() {
            console.info('Captcha expired. Resetting response object');
            vcRecaptchaService.reload($scope.widgetId);
            $scope.response = null;
        };


        $scope.register = function(form) {

            if (!$scope.response) { //if string is empty
                ValidationService.error('Please resolve the captcha and submit!');
            } else {
                $scope.user['g-recaptcha-response'] = $scope.response;
                $scope.submitted = true;

                if (form.$valid) {


                    if ($scope.user.password !== $scope.user.confirmPassword) {
                        ValidationService.error('Passwords do not match.');
                        return;
                    }

                    Auth.createUser($scope.user)
                        .then(function() {
                            ValidationService.success('You have been registered. Check your email to verify.');
                            // Account created, redirect to home
                            $location.path('/thanks');
                        }, function(err) {
                            ValidationService.displayErrors(form, err);
                        });
                }
            }


        };

        $scope.loginOauth = function(provider) {
            $window.location.href = '/auth/' + provider;
        };
    });
