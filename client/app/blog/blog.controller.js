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


    }).controller('BlogAddCtrl', function($scope, $stateParams, $location, Auth, ControllerUtil, BlogService) {

        var user = Auth.getCurrentUser();

        $scope.showSlug = true;

        $scope.post = {
            user_id: user._id
        };

        $scope.updateSlug = function() {
            $scope.post.slug = slugify($scope.post.title);
        };

        $scope.save = function(form) {

            if (ControllerUtil.validate($scope, form)) {

                var request = BlogService.save($scope.post).$promise;

                ControllerUtil.handle(request, form).then(function(data) {
                    $location.path('/blog/' + data._id);
                });
            }

        };


        $scope.imageUpload = function(files) {
            console.log('image upload:', files);
            console.log('image upload\'s editable:', $scope.editable);
        };

    }).controller('BlogEditCtrl', function($scope, $stateParams, $location, BlogService, ValidationService, Upload) {

        var id = $stateParams.id;

        $scope.showSlug = false;

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

                            // The image has been uploaded to your server.
                            // Now we need to insert the image back into the text editor.
                            //var uploaded_file_name = data.secure_url; // this is the filename as stored on your server.
                            var file_location = data.secure_url; //'https://res.cloudinary.com/ddovrks1z/image/upload/' + uploaded_file_name;

                            editor.insertImage($scope.editable, file_location, file_location);
                        });

                    }

                });
            }
        }

    }).controller('BlogViewCtrl', function($scope, $stateParams, Auth, BlogService, ValidationService, $location) {

        var id = $stateParams.id;

        BlogService.get({
            id: id
        }).$promise.then(function(post) {
            $scope.post = post;
        });

        $scope.delete = function(id) {
            if (id) {

                var r = confirm('Are you sure you want to delete?');
                if (r == true) {
                    BlogService.delete({
                        id: id
                    }).$promise.then(function() {
                        ValidationService.success('Post deleted.');

                        $location.path('/blog');

                    }, function() {
                        ValidationService.error('Delete Failed');
                    });
                }

            }
        };

    }).controller('UploadTestCtrl', function($scope, $rootScope, $timeout, Upload) {
        var d = new Date();

        $scope.title = "Image (" + d.getDate() + " - " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + ")";
        //$scope.$watch('files', function() {
        $scope.uploadFiles = function(files) {
            $scope.files = files;
            if (!$scope.files) {
                return;
            }
            angular.forEach(files, function(file) {
                if (file && !file.$error) {
                    file.upload = Upload.upload({
                        skipAuthorization: true,
                        url: "https://api.cloudinary.com/v1_1/" + "ddovrks1z" + "/upload",
                        fields: {
                            upload_preset: 'saogp2ap',
                            tags: 'myphotoalbum',
                            context: 'photo=' + $scope.title
                        },
                        file: file
                    }).progress(function(e) {
                        file.progress = Math.round((e.loaded * 100.0) / e.total);
                        file.status = "Uploading... " + file.progress + "%";
                    }).success(function(data, status, headers, config) {
                        $rootScope.photos = $rootScope.photos || [];
                        data.context = {
                            custom: {
                                photo: $scope.title
                            }
                        };
                        file.result = data;
                        $rootScope.photos.push(data);
                    }).error(function(data, status, headers, config) {
                        file.result = data;
                    });
                }
            });
        };
        //});

        /*
                $scope.uploadFile = function(file, errFiles) {
                    $scope.f = file;
                    $scope.errFile = errFiles && errFiles[0];
                    if (file) {
                        file.upload = Upload.upload({
                            skipAuthorization: true,
                            url: "https://api.cloudinary.com/v1_1/" + "ddovrks1z" + "/upload",
                            fields: {
                                upload_preset: 'saogp2ap',
                                tags: 'myphotoalbum',
                                context: 'photo=' + $scope.title
                            },

                            file: file
                        });

                        file.upload.then(function(response) {
                            $timeout(function() {
                                file.result = response.data;

                                var transformation = 'w_100,h_100,c_thumb,g_face'; //+ 'w_100,h100,c_thumb,g_face';

                                var public_id = file.result.public_id;

                                var url = 'https://res.cloudinary.com/ddovrks1z/image/upload/';

                                if (transformation) {
                                    url += transformation + '/';
                                }

                                url += public_id + '.' + file.result.format;

                                $scope.resultUrl = url;
                            });
                        }, function(response) {
                            if (response.status > 0) {
                                $scope.errorMsg = response.status + ': ' + response.data;
                            }
                        }, function(evt) {
                            file.progress = Math.min(100, parseInt(100.0 *
                                evt.loaded / evt.total));
                        });
                    }
                };

        */

        /* Modify the look and fill of the dropzone when files are being dragged over it */
        $scope.dragOverClass = function($event) {
            var items = $event.dataTransfer.items;
            var hasFile = false;
            if (items != null) {
                for (var i = 0; i < items.length; i++) {
                    if (items[i].kind == 'file') {
                        hasFile = true;
                        break;
                    }
                }
            } else {
                hasFile = true;
            }
            return hasFile ? "dragover" : "dragover-err";
        };

        $scope.exampleModel = {
            photo: '',
            photos: []
        };

        $scope.dump = function() {
            console.log($scope.exampleModel);
        };

    });
