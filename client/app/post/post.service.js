'use strict';

angular.module('preserveusApp')
    .factory('PostService', function($resource) {
        return $resource('/api/posts/:id/:controller', {
            id: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    });
