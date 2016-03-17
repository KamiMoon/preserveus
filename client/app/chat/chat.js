'use strict';

angular.module('preserveusApp')
    .config(function($stateProvider) {
        $stateProvider
            .state('chat', {
                url: '/chat',
                templateUrl: 'app/chat/chat.html',
                controller: 'ChatCtrl'
            });
    });
