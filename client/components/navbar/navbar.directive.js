'use strict';

angular.module('preserveusApp')
    .directive('navbar', function($location, Auth, $anchorScroll) {

        return {
            templateUrl: 'components/navbar/navbar.html',
            restrict: 'E',
            scope: {},
            link: function(scope, element, attrs) {
                scope.menu = [{
                    'title': 'Home',
                    'link': '/'
                }];

                scope.isCollapsed = true;
                scope.isLoggedIn = Auth.isLoggedIn;
                scope.isAdmin = Auth.isAdmin;
                scope.getCurrentUser = Auth.getCurrentUser;

                scope.logout = function() {
                    Auth.logout();
                    $location.path('/login');
                };

                scope.isActive = function(route) {
                    return route === $location.path();
                };

                scope.gotoHomeHash = function(hash, event) {
                    $location.path('/');

                    $location.hash(hash);

                    $anchorScroll();
                };

                $(".navbar-nav li a").click(function(event) {
                    $(".navbar-collapse").collapse('hide');
                });

            }
        };
    });
