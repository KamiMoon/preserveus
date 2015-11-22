'use strict';

angular.module('preserveusApp')
    .config(function($stateProvider) {
        $stateProvider.state('blogList', {
            url: '/blog',
            templateUrl: 'app/blog/blogList.html',
            controller: 'BlogCtrl'
        }).state('blogAdd', {
            url: '/blog/add',
            templateUrl: 'app/blog/blogAdd.html',
            controller: 'BlogAddCtrl'
        }).state('blogEdit', {
            url: '/blog/edit/:id',
            templateUrl: 'app/blog/blogAdd.html',
            controller: 'BlogEditCtrl'
        }).state('blogView', {
            url: '/blog/:id',
            templateUrl: 'app/blog/blogView.html',
            controller: 'BlogViewCtrl'
        });
    });
