'use strict';

angular.module('preserveusApp', [
        'ngCookies',
        'ngResource',
        'ngSanitize',
        'ui.router',
        'ui.mask',
        'ngTouch',
        'ngFileUpload',
        'ngStorage',
        'vcRecaptcha',
        'chart.js',
        'summernote',
        'uiGmapgoogle-maps',
        'cloudinary',
        'angularUtils.directives.dirDisqus'
    ])
    .config(function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, uiGmapGoogleMapApiProvider) {
        $urlRouterProvider
            .otherwise('/');

        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');

        $httpProvider.interceptors.push('authInterceptor');

        uiGmapGoogleMapApiProvider.configure({
            key: 'AIzaSyAH097-AkYDvIY7AAU42AlvFbxmUs69CRM',
            //v: '3.20', //defaults to latest 3.X anyhow
            //libraries: 'weather,geometry,visualization'
        });
    })

.factory('authInterceptor', function($rootScope, $q, $cookieStore, $location) {
    return {
        // Add authorization token to headers
        request: function(config) {
            config.headers = config.headers || {};
            if ($cookieStore.get('token') && !config.skipAuthorization) {
                config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
            }
            return config;
        },

        // Intercept 401s and redirect you to login
        responseError: function(response) {
            if (response.status === 401) {
                $location.path('/login');
                // remove any stale tokens
                $cookieStore.remove('token');
                return $q.reject(response);
            } else {
                return $q.reject(response);
            }
        }
    };
})

.run(function($rootScope, $location, $timeout, Auth) {
    $rootScope.Auth = Auth;

    $rootScope.generateImage = function(cloudinaryId, transform) {
        return 'https://res.cloudinary.com/ddovrks1z/image/upload/' + (transform || '') + cloudinaryId;
    };

    var getDefaultSEO = function() {
        return {
            title: 'Preserve US',
            description: 'Preserve US:  Restoring Historic Properties in Dallas, TX',
            keywords: 'Dallas, Real Estate, Investment, Rent',
            author: 'Eric Kizaki',
            url: window.location.href,
            type: 'article',
            image: 'https://www.preservedfw.com/assets/Preserve_US_nav_bar.png'
        };
    };

    //Defaults
    $rootScope.seo = getDefaultSEO();

    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function(event, next, toParams, fromState, fromParams) {
        Auth.isLoggedInAsync(function(loggedIn) {
            if (next.authenticate || next.roles && !loggedIn) {
                event.preventDefault();


                $timeout(function() {
                    $location.path('/login');
                });
            } else if (next.roles && !Auth.hasRoles(next.roles)) {
                event.preventDefault();
                $timeout(function() {
                    $location.path('/notAuthorized').replace();
                });
            }

            /*
            if (next.isOrgAdminFor && toParams[next.isOrgAdminFor] && !Auth.isOrgAdminFor(toParams[next.isOrgAdminFor])) {
                event.preventDefault();
                return $location.path('/notAuthorized').replace();
            }
            */
        });
    });

    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        $('html, body').scrollTop(0);

        $rootScope.seo = getDefaultSEO();

        $timeout(function() {
            $timeout(function() {
                window.prerenderReady = true;
            });
        });


    });

});

angular.module('preserveusApp').filter("sanitize", ['$sce', function($sce) {
    return function(htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };
}]);
