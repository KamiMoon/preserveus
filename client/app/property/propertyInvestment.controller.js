'use strict';

angular.module('preserveusApp')
    .controller('PropertyInvestmentCtrl', function($scope, $stateParams, PropertyService) {
        var action = $stateParams.action;
        var id = $stateParams.id;



        //in all cases a property must exist before adding
        PropertyService.get({
            id: id
        }).$promise.then(function(property) {
            $scope.property = property;

            $scope.property.pricePerSqft = property.cost / property.sqft;

            $scope.property.equityInvestedPercent = $scope.property.equityInvestedPercent || 20;
            $scope.property.equityInvested = property.cost * ($scope.property.equityInvestedPercent / 100);

            $scope.property.avgCompSalePrice = 140 * $scope.property.sqft;
            $scope.property.debtHeld = $scope.property.cost - $scope.property.equityInvested;



            //hardcode for right now
            $scope.property.monthlyRentalRevenue = 4075.00;
            $scope.property.mortgagePrinciple = $scope.property.mortgagePrinciple || 2100.00;
            $scope.property.taxes = $scope.property.taxes || 671.25;
            $scope.property.insurance = $scope.property.insurance || 166.67;
            $scope.property.monthlyRemodelExpense = $scope.property.monthlyRemodelExpense || 500.00;
            $scope.property.yearsToHold = $scope.property.yearsToHold || 5;

            $scope.monthlyRevenueChange();
        });

        //it is always an update against an existing property or purely view mode


        $scope.changeEquity = function() {
            if ($scope.property.equityInvestedPercent < 0) {
                $scope.property.equityInvestedPercent = 0;
            }
            if ($scope.property.equityInvestedPercent > 100) {
                $scope.property.equityInvestedPercent = 100;
            }
            $scope.property.equityInvested = $scope.property.cost * ($scope.property.equityInvestedPercent / 100);
            $scope.property.debtHeld = $scope.property.cost - $scope.property.equityInvested;

            $scope.calculateYearBasedData();
        };

        $scope.changeEquityPercent = function() {

            $scope.property.equityInvestedPercent = ($scope.property.equityInvested / $scope.property.cost) * 100;
            $scope.property.debtHeld = $scope.property.cost - $scope.property.equityInvested;
            $scope.calculateYearBasedData();
        };

        $scope.monthlyRevenueChange = function() {
            $scope.property.currentRentalRevenue = $scope.property.monthlyRentalRevenue * 12;
            $scope.property.projectedMonthlyRentalRevenue = Math.round($scope.property.monthlyRentalRevenue * 1.1);
            $scope.property.projectedRentalRevenue = $scope.property.currentRentalRevenue * 1.12;
            $scope.property.monthlyManagementFee = $scope.property.monthlyRentalRevenue * 0.08;
            $scope.property.projectedManagementFee = $scope.property.projectedMonthlyRentalRevenue * 0.12;

            $scope.calculateTotalMonthlyProfits();
        };

        $scope.calculateTotalMonthlyProfits = function() {
            var totalCost = $scope.property.mortgagePrinciple + $scope.property.taxes + $scope.property.insurance + $scope.property.monthlyRemodelExpense;
            $scope.property.currentMonthlyProfit = $scope.property.monthlyRentalRevenue - (totalCost + $scope.property.monthlyManagementFee);
            $scope.property.projectedMonthlyProfit = $scope.property.projectedMonthlyRentalRevenue - (totalCost + $scope.property.projectedManagementFee);
            $scope.property.currentYearlyProfit = $scope.property.currentMonthlyProfit * 12;
            $scope.property.projectedMonthlyProfit = $scope.property.projectedMonthlyProfit * 12;
            $scope.calculateYearBasedData();
        };

        $scope.calculateYearBasedData = function() {
            $scope.property.totalValueToAdd = $scope.property.monthlyRemodelExpense * 12 * $scope.property.yearsToHold;
            $scope.property.projectedAmountOfDebt = (($scope.property.mortgagePrinciple * 12) * 0.94) * $scope.property.yearsToHold;
            $scope.property.projectedProfitAtFinal = ($scope.property.avgCompSalePrice * 0.96) - ($scope.property.debtHeld - $scope.property.projectedAmountOfDebt) - $scope.property.equityInvested - $scope.property.totalValueToAdd;
            $scope.property.exitTotal = $scope.property.projectedProfitAtFinal * (1 - 0.12) + $scope.property.equityInvested;

            $scope.property.projectedReturnsByYear = [-1 * $scope.property.equityInvested, $scope.property.currentYearlyProfit, $scope.property.currentYearlyProfit, $scope.property.projectedMonthlyProfit, $scope.property.projectedMonthlyProfit, $scope.property.exitTotal];

            var sum = 0;
            for (var i = 0; i < $scope.property.projectedReturnsByYear.length; i++) {
                sum += $scope.property.projectedReturnsByYear[i];
            }

            $scope.property.finalTotal = sum;

        };


    });
