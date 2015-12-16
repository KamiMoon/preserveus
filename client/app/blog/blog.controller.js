'use strict';

angular.module('preserveusApp')
    .controller('BlogCtrl', function($scope, $stateParams, BlogService) {

        var searchParams = {};

        if ($stateParams.keyword) {
            searchParams['keywords.text'] = $stateParams.keyword;
        }

        $scope.posts = BlogService.query(searchParams);

    }).controller('BlogAddEditCtrl', function($scope, $stateParams, $location, BlogService, ValidationService, Auth, Upload, ControllerUtil) {
        var action = $stateParams.action;
        var id = $stateParams.id;
        var user = Auth.getCurrentUser();

        if (action === 'edit') {
            $scope.post = BlogService.get({
                id: id
            });
        } else {
            $scope.post = {
                user_id: user._id,
                user_name: user.name,
                keywords: []
            };
        }

        var createKeywordRow = function() {
            return {
                text: ''
            };
        };

        $scope.keywordToAdd = createKeywordRow();

        $scope.deleteKeyword = function(keyword) {
            for (var i = 0; i < $scope.post.keywords.length; i++) {
                if ($scope.post.keywords[i].$$hashKey === keyword.$$hashKey) {
                    $scope.post.keywords.splice(i, 1);
                    break;
                }
            }
        };

        $scope.addKeyword = function() {
            $scope.post.keywords.push($scope.keywordToAdd);

            $scope.keywordToAdd = createKeywordRow();
        };

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

                            //$scope.editable.addClass('img-responsive');

                            editor.insertImage($scope.editable, file_location, file_location);
                        });
                    }
                });
            }
        }

    }).controller('BlogViewCtrl', function($scope, $rootScope, $stateParams, Auth, BlogService, ValidationService, $location, ControllerUtil) {

        var id = $stateParams.id;
        $scope.contentLoaded = false;

        BlogService.get({
            id: id
        }).$promise.then(function(post) {
            $scope.post = post;
            $scope.contentLoaded = true;

            //set SEO
            $rootScope.seo.title = post.title;
            $rootScope.seo.description = post.headingQuote;
            if (post.photo) {
                $rootScope.seo.image = $rootScope.generateImage(post.photo);
            }

        });

        $scope.delete = function() {
            ControllerUtil.delete(id, BlogService, '/blog');
        };

    });
