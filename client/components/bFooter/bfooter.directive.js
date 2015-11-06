'use strict';

angular.module('preserveusApp')
    .directive('bFooter', function() {
        return {
            templateUrl: 'components/bFooter/footer.html',
            restrict: 'E',
            link: function postLink(scope, element, attrs) {

                var $goToTop = $('#go-to-top');

                //jQuery
                $goToTop.on('touchstart click', function() {
                    $('html, body').animate({
                        scrollTop: 0
                    }, 600);
                });

                //capture scroll any percentage
                $(window).scroll(function() {

                    var wintop = $(window).scrollTop(),
                        docheight = $(document).height(),
                        winheight = $(window).height();
                    var scrolltrigger = 0.50;

                    if ((wintop / (docheight - winheight)) > scrolltrigger) {
                        $goToTop.show();
                    } else {
                        $goToTop.hide();
                    }
                });
            }
        };
    });
