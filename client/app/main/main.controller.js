'use strict';

angular.module('preserveusApp')
    .controller('MainCtrl', function($scope, $http) {

    }).controller('ContactCtrl', function($scope, $http, ValidationService) {
        $scope.contact = {
            name: '',
            email: '',
            message: ''
        };

        $scope.save = function(form) {
            $scope.submitted = true;

            if (form.$valid) {
                $http.post('api/contacts/contactus', $scope.contact).then(function() {
                    ValidationService.success('Your message has been successfully sent.');
                }, function(err) {
                    ValidationService.error();
                });
            }
        };

    });
