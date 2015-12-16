'use strict';

angular.module('preserveusApp')
    .directive('addToAny', function($timeout) {
        return {
            templateUrl: 'components/social/addToAny.html',
            restrict: 'E',
            scope: {
                url: '@',
                title: '@'
            },
            link: function postLink(scope, element, attrs) {
                //https://www.addtoany.com/buttons/customize/multiple_buttons_customize
                a2a_config.linkname = attrs.title;
                a2a_config.linkurl = window.location.origin + attrs.url;
                a2a.init('page');
            }
        };
    });
