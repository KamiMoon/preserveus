'use strict';

angular.module('preserveusApp')
    .factory('PropertyService', function($resource) {
        return $resource('/api/properties/:id/:controller', {
            id: '@_id'
        }, {
            update: {
                method: 'PUT',

            },
            getIncomeReport: {
                method: 'GET',
                url: 'api/properties/propertyIncomeReport/:id'
            },
            getPropertyTotalReport: {
                method: 'GET',
                url: 'api/properties/propertyTotalReport'
            }
        });
    });
