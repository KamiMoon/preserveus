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

                console.log(scope);

                console.log('attrs');
                console.log(attrs);

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

                                //var transformation = 'w_100,h_100,c_thumb,g_face'; //+ 'w_100,h100,c_thumb,g_face';

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
            }
        };
    });
