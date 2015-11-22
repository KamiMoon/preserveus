'use strict';

function slugify(text) {

    if (text) {
        return text.toString().toLowerCase()
            .replace(/\s+/g, '-') // Replace spaces with -
            .replace(/[^\w\-]+/g, '') // Remove all non-word chars
            .replace(/\-\-+/g, '-') // Replace multiple - with single -
            .replace(/^-+/, '') // Trim - from start of text
            .replace(/-+$/, ''); // Trim - from end of text
    } else {
        return '';
    }

}

angular.module('preserveusApp')
    .controller('BlogCtrl', function($scope, BlogService, ValidationService) {

        $scope.posts = BlogService.query();


    }).controller('BlogAddCtrl', function($scope, $stateParams, $location, Auth, ControllerUtil) {

        var user = Auth.getCurrentUser();

        $scope.post = {
            user_id: user._id
        };

        $scope.updateSlug = function() {
            console.log('updateSlug');
            $scope.post.slug = slugify($scope.post.title);
        };

        $scope.save = function(form) {

            if (ControllerUtil.validate($scope, form)) {

                var request = ControllerUtil.upload({
                    url: '/api/blog/',
                    method: 'POST',
                    file: $scope.photo,
                    data: $scope.post
                });

                ControllerUtil.handle(request, form).then(function(data) {
                    $location.path('/blog/' + data.data._id);
                });
            }

        };

    }).controller('BlogEditCtrl', function($scope, $stateParams, $location, BlogService, ValidationService) {

        var id = $stateParams.id;

        $scope.post = BlogService.get({
            id: id
        });

        $scope.save = function(form) {
            $scope.submitted = true;

            if (form.$valid) {
                BlogService.update({
                    id: $scope.post._id
                }, $scope.post).$promise.then(function() {
                    ValidationService.success();
                    $location.path('/blog/' + id);
                }, function(err) {
                    ValidationService.displayErrors(form, err);
                });
            }
        };

    }).controller('BlogViewCtrl', function($scope, $stateParams, Auth, BlogService) {

        var id = $stateParams.id;

        BlogService.get({
            id: id
        }).$promise.then(function(post) {
            $scope.post = post;
        });

    });
