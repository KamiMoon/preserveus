'use strict';

angular.module('preserveusApp')
    .controller('MainCtrl', function($scope, $http) {

    }).controller('ContactCtrl', function($scope, $http, vcRecaptchaService, ValidationService) {
        $scope.contact = {
            name: '',
            email: '',
            message: ''
        };

        $scope.save = function(form) {

            var captchaResponse = vcRecaptchaService.getResponse();

            if (captchaResponse === '') { //if string is empty
                ValidationService.error('Please resolve the captcha and submit!');
            } else {
                $scope.contact['g-recaptcha-response'] = vcRecaptchaService.getResponse();
                $scope.submitted = true;


                if (form.$valid) {

                    $http.post('api/contacts/contactus', $scope.contact).then(function() {
                        ValidationService.success('Your Message Has Been Sent.');
                    }, function(err) {
                        ValidationService.error();
                    });
                }
            }

        };

    });
