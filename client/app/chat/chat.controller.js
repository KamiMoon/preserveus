'use strict';

angular.module('preserveusApp')
    .controller('ChatCtrl', function($scope, $http, socket, CONSTANTS) {
        $scope.awesomeThings = [];

        $http.get(CONSTANTS.DOMAIN + '/api/things').success(function(awesomeThings) {
            $scope.awesomeThings = awesomeThings;
            socket.syncUpdates('thing', $scope.awesomeThings);
        });

        $scope.addThing = function() {
            if ($scope.newThing === '') {
                return;
            }
            $http.post(CONSTANTS.DOMAIN + '/api/things', { name: $scope.newThing });
            $scope.newThing = '';
        };

        $scope.deleteThing = function(thing) {
            $http.delete(CONSTANTS.DOMAIN + '/api/things/' + thing._id);
        };

        $scope.$on('$destroy', function() {
            socket.unsyncUpdates('thing');
        });
    });
