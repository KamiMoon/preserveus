'use strict';

angular.module('preserveusApp')
    .factory('ListingService', function($resource) {
        return $resource('/api/listings/:id/:controller', {
            id: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    });
