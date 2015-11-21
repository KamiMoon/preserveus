'use strict';

angular.module('preserveusApp')
    .config(function($stateProvider) {
        $stateProvider.state('postList', {
            url: '/post',
            templateUrl: 'app/post/postList.html',
            controller: 'PostCtrl'
        }).state('postAdd', {
            url: '/post/add/:organization_id',
            templateUrl: 'app/post/postAdd.html',
            controller: 'PostAddCtrl'
        }).state('postEdit', {
            url: '/post/edit/:id',
            templateUrl: 'app/post/postAdd.html',
            controller: 'PostEditCtrl'
        }).state('postView', {
            url: '/post/view/:id',
            templateUrl: 'app/post/postView.html',
            controller: 'PostViewCtrl'
        });
    });
