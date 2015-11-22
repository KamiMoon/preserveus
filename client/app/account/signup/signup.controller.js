'use strict';

angular.module('preserveusApp')
    .controller('SignupCtrl', function($scope, Auth, $location, $window, ValidationService, vcRecaptchaService) {
        $scope.user = {};

        $scope.register = function(form) {

            var captchaResponse = vcRecaptchaService.getResponse();

            if (captchaResponse === '') { //if string is empty
                ValidationService.error('Please resolve the captcha and submit!');
            } else {
                $scope.user['g-recaptcha-response'] = vcRecaptchaService.getResponse();

                $scope.submitted = true;

                if (form.$valid) {

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
