'use strict';

function IRR(values, guess) {
    // Credits: algorithm inspired by Apache OpenOffice

    // Calculates the resulting amount
    var irrResult = function(values, dates, rate) {
        var r = rate + 1;
        var result = values[0];
        for (var i = 1; i < values.length; i++) {
            result += values[i] / Math.pow(r, (dates[i] - dates[0]) / 365);
        }
        return result;
    }

    // Calculates the first derivation
    var irrResultDeriv = function(values, dates, rate) {
        var r = rate + 1;
        var result = 0;
        for (var i = 1; i < values.length; i++) {
            var frac = (dates[i] - dates[0]) / 365;
            result -= frac * values[i] / Math.pow(r, frac + 1);
        }
        return result;
    }

    // Initialize dates and check that values contains at least one positive value and one negative value
    var dates = [];
    var positive = false;
    var negative = false;
    for (var i = 0; i < values.length; i++) {
        dates[i] = (i === 0) ? 0 : dates[i - 1] + 365;
        if (values[i] > 0) positive = true;
        if (values[i] < 0) negative = true;
    }

    // Return error if values does not contain at least one positive value and one negative value
    if (!positive || !negative) return '#NUM!';

    // Initialize guess and resultRate
    var guess = (typeof guess === 'undefined') ? 0.1 : guess;
    var resultRate = guess;

    // Set maximum epsilon for end of iteration
    var epsMax = 1e-10;

    // Set maximum number of iterations
    var iterMax = 50;

    // Implement Newton's method
    var newRate, epsRate, resultValue;
    var iteration = 0;
    var contLoop = true;
    do {
        resultValue = irrResult(values, dates, resultRate);
        newRate = resultRate - resultValue / irrResultDeriv(values, dates, resultRate);
        epsRate = Math.abs(newRate - resultRate);
        resultRate = newRate;
        contLoop = (epsRate > epsMax) && (Math.abs(resultValue) > epsMax);
    } while (contLoop && (++iteration < iterMax));

    if (contLoop) return '#NUM!';

    // Return internal rate of return
    return resultRate;
}


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
            $scope.property.projectedMonthlyRentalRevenue = $scope.property.units * 1250;
            $scope.property.projectedRentalRevenue = $scope.property.currentRentalRevenue * 12;

            $scope.property.monthlyManagementFee = $scope.property.monthlyRentalRevenue * 0.12;
            $scope.property.projectedManagementFee = $scope.property.projectedMonthlyRentalRevenue * 0.12;

            $scope.calculateTotalMonthlyProfits();
        };

        $scope.calculateTotalMonthlyProfits = function() {
            var totalCost = $scope.property.mortgagePrinciple + $scope.property.taxes + $scope.property.insurance + $scope.property.monthlyRemodelExpense;
            $scope.property.currentMonthlyProfit = $scope.property.monthlyRentalRevenue - (totalCost + $scope.property.monthlyManagementFee);
            $scope.property.projectedMonthlyProfit = $scope.property.projectedMonthlyRentalRevenue - (totalCost + $scope.property.projectedManagementFee);

            $scope.property.currentYearlyProfit = $scope.property.currentMonthlyProfit * 12;
            $scope.property.projectedYearlyProfit = $scope.property.projectedMonthlyProfit * 12;
            $scope.calculateYearBasedData();
        };

        $scope.calculateYearBasedData = function() {
            $scope.property.totalValueToAdd = $scope.property.monthlyRemodelExpense * 12 * $scope.property.yearsToHold;
            $scope.property.projectedAmountOfDebt = (($scope.property.mortgagePrinciple * 12) * 0.94) * $scope.property.yearsToHold;
            $scope.property.projectedProfitAtFinal = ($scope.property.avgCompSalePrice * 0.96) - ($scope.property.debtHeld - $scope.property.projectedAmountOfDebt) - $scope.property.equityInvested - $scope.property.totalValueToAdd;
            $scope.property.exitTotal = $scope.property.projectedProfitAtFinal * (1 - 0.12) + $scope.property.equityInvested;

            $scope.property.projectedReturnsByYear = [$scope.property.currentYearlyProfit, $scope.property.currentYearlyProfit, $scope.property.projectedYearlyProfit, $scope.property.projectedYearlyProfit, $scope.property.exitTotal];

            var sum = 0;
            var netPresentValue = 0;
            for (var i = 0; i < $scope.property.projectedReturnsByYear.length; i++) {
                sum += $scope.property.projectedReturnsByYear[i];


                netPresentValue += $scope.property.projectedReturnsByYear[i] / (Math.pow(1.05, i + 1));

            }
            console.log(netPresentValue);
            netPresentValue -= $scope.property.equityInvested;

            $scope.property.finalTotal = sum - $scope.property.equityInvested;

            $scope.property.returnOnInvestmentPercent = Math.round(($scope.property.finalTotal / $scope.property.equityInvested) * 100);
            $scope.property.avgReturnPerYear = sum / $scope.property.yearsToHold;

            var irrArray = angular.copy($scope.property.projectedReturnsByYear); //.unshift(-1 * $scope.property.equityInvested);
            irrArray.unshift(-1 * $scope.property.equityInvested);
            console.log(irrArray);
            $scope.property.irr = Math.round(IRR(irrArray) * 100);
            $scope.property.netPresentValue = netPresentValue;
        };


    });
