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
    .controller('BlogCtrl', function($scope, BlogService) {
        $scope.posts = BlogService.query();

    }).controller('BlogAddEditCtrl', function($scope, $stateParams, $location, BlogService, ValidationService, Auth, Upload, ControllerUtil) {
        var action = $stateParams.action;
        var id = $stateParams.id;
        var user = Auth.getCurrentUser();

        if (action === 'edit') {
            $scope.showSlug = false;

            $scope.post = BlogService.get({
                id: id
            });
        } else {
            $scope.showSlug = true;

            $scope.post = {
                user_id: user._id
            };

            $scope.updateSlug = function() {
                $scope.post.slug = slugify($scope.post.title);
            };
        }

        $scope.save = function(form) {
            var request;

            if (ControllerUtil.validate($scope, form)) {

                if (action === 'edit') {
                    request = BlogService.update({
                        id: $scope.post._id
                    }, $scope.post).$promise;

                    ControllerUtil.handle(request, form).then(function() {
                        $location.path('/blog/' + id);
                    });
                } else {
                    request = BlogService.save($scope.post).$promise;

                    ControllerUtil.handle(request, form).then(function(data) {
                        $location.path('/blog/' + data._id);
                    });
                }
            }
        };

        $scope.imageUpload = function(files) {
            uploadEditorImage(files);
        };

        var editor = $.summernote.eventHandler.getModule();

        function uploadEditorImage(files) {
            if (files) {
                angular.forEach(files, function(file) {
                    if (file) {
                        Upload.upload({
                            skipAuthorization: true,
                            url: "https://api.cloudinary.com/v1_1/" + "ddovrks1z" + "/upload",
                            fields: {
                                upload_preset: 'saogp2ap' //,
                                    //tags: 'myphotoalbum',
                                    //context: 'photo=' + scope.title
                            },

                            file: file
                        }).success(function(data, status, headers, config) {
                            var file_location = data.secure_url;
                            editor.insertImage($scope.editable, file_location, file_location);
                        });
                    }
                });
            }
        }

    }).controller('BlogViewCtrl', function($scope, $stateParams, Auth, BlogService, ValidationService, $location, ControllerUtil) {

        var id = $stateParams.id;

        BlogService.get({
            id: id
        }).$promise.then(function(post) {
            $scope.post = post;
        });

        $scope.delete = function() {
            ControllerUtil.delete(id, BlogService, '/blog');
        };

    });
