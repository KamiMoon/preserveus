'use strict';

angular.module('preserveusApp')
    .directive('blogPost', function($timeout) {
        return {
            templateUrl: 'app/blog/post.html',
            restrict: 'E',
            link: function postLink(scope, element, attrs) {

                /*
                $timeout(function() {
                    $timeout(function() {
                        $(element).find('pre code').each(function(i, block) {
                            hljs.highlightBlock(block);
                        });
                    });
                });
*/
            }
        };
    });
