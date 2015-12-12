'use strict';

angular.module('preserveusApp')
    .directive('blogPost', function() {
        return {
            templateUrl: 'app/blog/post.html',
            restrict: 'E',
            link: function postLink(scope, element, attrs) {

            }
        };
    });
