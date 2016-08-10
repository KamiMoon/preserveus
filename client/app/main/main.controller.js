'use strict';

angular.module('preserveusApp')
    .controller('MainCtrl', function($scope, $http) {

    }).controller('ContactCtrl', function($scope, $http, vcRecaptchaService, ValidationService) {
        $scope.contact = {
            name: '',
            email: '',
            message: ''
        };

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

        $scope.save = function(form) {

            if (!$scope.response) { //if string is empty
                ValidationService.error('Please resolve the captcha and submit!');
            } else {
                $scope.contact['g-recaptcha-response'] = $scope.response;
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
        $scope.labels = ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'];
        $scope.series = ['S&P 500', 'Preserve US'];
        $scope.data = [
            [10000.00, 10000.00, 10000.00, 10000.00, 10000.00],
            [1777.00, 1777.00, 11545.00, 11545.00, 201541.82]
        ];

        $scope.options = {
            scaleBeginAtZero: true,
            scaleLabel: function(label) {
                return '$' + label.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            },
            tooltipTemplate: function(label) {
                return '$' + label.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            },
            multiTooltipTemplate: function(label) {
                return '$' + label.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
        };

        $scope.colours = ['#0000FF', '#FF0000'];
    });
