'use strict';

angular.module('preserveusApp')
    .directive('bImg', function() {
        return {
            //transclude: true,
            scope: {
                transformation: '@',
                format: '@'
            },
            replace: true,
            template: '<img ng-src="{{url}}">',
            restrict: 'E',
            link: function postLink(scope, element, attrs) {
                var url = 'https://res.cloudinary.com/ddovrks1z/image/upload/';

                var unregister = attrs.$observe('publicId', function(value) {

                    if (value) {

                        scope.format = scope.format || 'jpg';

                        if (scope.transformation) {
                            url += scope.transformation + '/';
                        }

                        scope.url = url + value + '.' + scope.format;

                        unregister();
                    }

                });


            }
        };
    });
