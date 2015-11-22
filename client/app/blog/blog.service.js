'use strict';

angular.module('preserveusApp')
    .factory('BlogService', function($resource) {
        return $resource('/api/blog/:id/:controller', {
            id: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    });
