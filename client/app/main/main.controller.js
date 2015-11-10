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

    }).controller('PropertiesCtrl', function($scope, $http) {
        $scope.labels = ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Exit'];
        $scope.series = ['S&P 500', 'Preserve US'];
        $scope.options = {
            scaleBeginAtZero: true
        };
        $scope.data = [
            [10.00, 10.00, 10.00, 10.00, 10.00, 10.00],
            [10.00, 10.00, 11.00, 13.90, 14.80, 24.20]

        ];
        $scope.colours = ['#0000FF', '#FF0000'];
        $scope.onClick = function(points, evt) {
            console.log(points, evt);
        };
    });
