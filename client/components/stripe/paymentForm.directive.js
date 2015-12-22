'use strict';

angular.module('preserveusApp')
    .directive('stripePaymentForm', function($q, $http, $location, ValidationService) {


        var loadScriptIfNeeded = function() {
            var deferred = $q.defer();

            if (!window.Stripe) {
                $.getScript("https://js.stripe.com/v2/", function(data, textStatus, jqxhr) {
                    Stripe.setPublishableKey('pk_test_4uDBOrpIEdDtHAZbXVfOZHjB');

                    deferred.resolve();
                });
            } else {
                deferred.resolve();
            }

            return deferred.promise;
        };

        return {
            templateUrl: 'components/stripe/paymentForm.directive.html',
            restrict: 'E',
            scope: {
                model: '@',
                user: '@',
                url: '@',
                redirectUrl: '@',
                amount: '@'
            },
            link: function postLink($scope, $element, attrs) {
                $scope.submitted = false;
                $scope.errors = {};
                $scope.form = {};
                $scope.disabled = false;

                var stripeResponseHandler = function(status, response) {
                    if (response.error) {
                        // Show the errors on the form
                        $scope.errors.payment = response.error.message;
                        $scope.disabled = false;
                    } else {
                        // token contains id, last4, and card type
                        var token = response.id;

                        var messageToPost = {
                            stripeToken: token,
                            amount: $scope.form.amount,
                            user_id: $scope.user,
                            model_id: $scope.model
                        };

                        $http.post($scope.url, messageToPost).then(function(response) {
                            //success
                            ValidationService.success('Payment Successful.  An email with your receipt has been sent to you.');

                            $location.path($scope.redirectUrl);
                        }, function(response) {
                            //errors
                            $scope.errors = {};
                            $scope.errors.payment = response.data;

                            $scope.disabled = false;
                        });


                    }
                };

                loadScriptIfNeeded().then(function() {

                    $('#cc-number').payment('formatCardNumber');
                    $('#cc-cvc').payment('formatCardCVC');
                    $('#exp-month').payment('restrictNumeric');
                    $('#exp-year').payment('restrictNumeric');

                    $scope.save = function(form) {
                        $scope.submitted = true;

                        $scope.errors = {};

                        var $form = $('#payment-form');
                        var cardNumber = $("#cc-number").val();
                        var cvc = $("#cc-cvc").val();
                        var month = $("#exp-month").val();
                        var year = $("#exp-year").val();
                        var amount = $('#amount').val();

                        var valid = true;


                        if (!amount || amount <= 0) {
                            $scope.errors['amount'] = 'Enter an amount.';
                            valid = false;
                        }

                        var carTypeIsValid = $.payment.cardType(cardNumber);
                        if (!carTypeIsValid) {
                            $scope.errors['cc-number'] = 'Invalid card type.';
                            valid = false;
                        }

                        var cardNumberIsValid = $.payment.validateCardNumber(cardNumber);
                        if (!cardNumberIsValid) {
                            $scope.errors['cc-number'] = 'Invalid Card Number.';
                            valid = false;
                        }

                        var cvcIsValid = $.payment.validateCardCVC(cvc);
                        if (!cvcIsValid) {
                            $scope.errors['cc-cvc'] = 'Invalid CVC.';
                            valid = false;
                        }

                        var expiryIsValid = $.payment.validateCardExpiry(month, year);
                        if (!expiryIsValid) {
                            $scope.errors['expiry'] = 'Invalid Expiry Date.';
                            valid = false;
                        }

                        if (valid) {
                            // Disable the submit button to prevent repeated clicks
                            $scope.disabled = true;
                            Stripe.card.createToken($form, stripeResponseHandler);
                        }

                        // Prevent the form from submitting with the default action
                        return false;
                    };
                });

            }
        };
    });
