'use strict';

angular.module('preserveusApp')
    .config(function($stateProvider) {
        $stateProvider.state('blogList', {
            url: '/blog',
            templateUrl: 'app/blog/blogList.html',
            controller: 'BlogCtrl'
        }).state('blogAddEdit', {
            url: '/blog/:action/:id',
            templateUrl: 'app/blog/blogAdd.html',
            controller: 'BlogAddEditCtrl'
        }).state('blogView', {
            url: '/blog/:id',
            templateUrl: 'app/blog/blogView.html',
            controller: 'BlogViewCtrl'
        }).state('blogKeyword', {
            url: '/blogKeyword/:keyword',
            templateUrl: 'app/blog/blogList.html',
            controller: 'BlogCtrl'
        });
    });
