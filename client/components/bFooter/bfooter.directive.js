'use strict';

angular.module('preserveusApp')
    .directive('bFooter', function() {
        return {
            templateUrl: 'components/bFooter/footer.html',
            restrict: 'E',
            link: function postLink(scope, element, attrs) {}
        };
    });
