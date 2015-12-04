'use strict';

angular.module('preserveusApp')
    .directive('bUpload', function($rootScope, $timeout, Upload) {
        return {
            templateUrl: 'components/bInput/bUpload.directive.html',
            scope: {
                ngModel: '=',
                transformation: '@'
            },
            restrict: 'E',
            link: function(scope, element, attrs) {

                scope.uploadFile = function(file, errFiles) {
                    scope.f = file;
                    scope.errFile = errFiles && errFiles[0];
                    if (file) {
                        file.upload = Upload.upload({
                            skipAuthorization: true,
                            url: "https://api.cloudinary.com/v1_1/" + "ddovrks1z" + "/upload",
                            fields: {
                                upload_preset: 'saogp2ap' //,
                                    //tags: 'myphotoalbum',
                                    //context: 'photo=' + scope.title
                            },

                            file: file
                        });

                        file.upload.then(function(response) {
                            $timeout(function() {
                                file.result = response.data;

                                var public_id = file.result.public_id;

                                var url = 'https://res.cloudinary.com/ddovrks1z/image/upload/';

                                if (scope.transformation) {
                                    url += scope.transformation + '/';
                                }

                                url += public_id + '.' + file.result.format;

                                scope.resultUrl = url;
                                //set on the user API
                                scope.ngModel = public_id;

                            });
                        }, function(response) {
                            if (response.status > 0) {
                                scope.errorMsg = response.status + ': ' + response.data;
                            }
                        }, function(evt) {
                            file.progress = Math.min(100, parseInt(100.0 *
                                evt.loaded / evt.total));
                        });
                    }
                };

                scope.remove = function() {
                    scope.f = null;
                    scope.errFile = null;
                    scope.errorMsg = null;
                    scope.ngModel = null;
                    scope.resultUrl = null;
                };

            }
        };
    }).directive('bUploadMultiple', function($rootScope, $timeout, Upload) {
        return {
            templateUrl: 'components/bInput/bUploadMultiple.directive.html',
            scope: {
                ngModel: '=',
                transformation: '@'
            },

            restrict: 'E',
            link: function(scope, element, attrs) {




                scope.uploadFiles = function(files, errFiles) {
                    scope.files = files;
                    scope.errFiles = errFiles;

                    angular.forEach(files, function(file) {

                        if (file && !file.$error) {

                            file.upload = Upload.upload({
                                skipAuthorization: true,
                                url: "https://api.cloudinary.com/v1_1/" + "ddovrks1z" + "/upload",
                                fields: {
                                    upload_preset: 'saogp2ap' //,
                                        //tags: 'myphotoalbum',
                                        //context: 'photo=' + scope.title
                                },

                                file: file
                            });

                            file.upload.then(function(response) {
                                $timeout(function() {
                                    file.result = response.data;

                                    var public_id = file.result.public_id;

                                    var url = 'https://res.cloudinary.com/ddovrks1z/image/upload/';

                                    if (scope.transformation) {
                                        url += scope.transformation + '/';
                                    }

                                    url += public_id + '.' + file.result.format;

                                    //set on the user API
                                    if (scope.ngModel) {
                                        scope.ngModel.push(public_id);
                                    }


                                });
                            }, function(response) {
                                if (response.status > 0) {
                                    scope.errorMsg = response.status + ': ' + response.data;
                                }
                            }, function(evt) {
                                file.progress = Math.min(100, parseInt(100.0 *
                                    evt.loaded / evt.total));
                            });

                        }
                    });


                };

                scope.remove = function(index) {
                    scope.errorMsg = null;
                    scope.files.splice(index, 1);

                    if (scope.errFiles) {
                        scope.errFiles.splice(index, 1);
                    }

                    if (scope.ngModel) {
                        scope.ngModel.splice(index, 1);
                    }

                };

            }
        };
    });
