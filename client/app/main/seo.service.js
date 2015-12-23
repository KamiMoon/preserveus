'use strict';

angular.module('preserveusApp')
    .service('SEOService', function($rootScope) {

        $rootScope.seo = {};

        var defaultImage = 'https://www.preservedfw.com/assets/Preserve_US_nav_bar.png';

        this.getDefaultSEO = function() {
            return {
                title: 'Preserve US',
                description: 'Preserve US:  Restoring Historic Properties in Dallas, TX',
                keywords: 'Dallas, Real Estate, Investment, Rent',
                author: 'Eric Kizaki',
                url: window.location.href,
                type: 'article',
                image: defaultImage
            };
        };


        this.setSEO = function(seo) {

            //use whatever was left
            for (var property in seo) {
                if (property === 'image') {
                    $rootScope.seo.image = $rootScope.generateImage(seo.image, 'w_200,h_200,c_fill');
                } else {
                    $rootScope.seo[property] = seo[property];
                }
            }

        };

    });
