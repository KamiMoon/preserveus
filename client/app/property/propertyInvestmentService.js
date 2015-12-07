'use strict';

angular.module('preserveusApp')
    .service('PropertyInvestmentService', function($timeout) {

        this.IRR = function(values, guess) {
            // Credits: algorithm inspired by Apache OpenOffice

            // Calculates the resulting amount
            var irrResult = function(values, dates, rate) {
                var r = rate + 1;
                var result = values[0];
                for (var i = 1; i < values.length; i++) {
                    result += values[i] / Math.pow(r, (dates[i] - dates[0]) / 365);
                }
                return result;
            };

            // Calculates the first derivation
            var irrResultDeriv = function(values, dates, rate) {
                var r = rate + 1;
                var result = 0;
                for (var i = 1; i < values.length; i++) {
                    var frac = (dates[i] - dates[0]) / 365;
                    result -= frac * values[i] / Math.pow(r, frac + 1);
                }
                return result;
            };

            // Initialize dates and check that values contains at least one positive value and one negative value
            var dates = [];
            var positive = false;
            var negative = false;
            for (var i = 0; i < values.length; i++) {
                dates[i] = (i === 0) ? 0 : dates[i - 1] + 365;
                if (values[i] > 0) {
                    positive = true;
                }
                if (values[i] < 0) {
                    negative = true;
                }
            }

            // Return error if values does not contain at least one positive value and one negative value
            if (!positive || !negative) {
                return '#NUM!';
            }

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

            if (contLoop) {
                return '#NUM!';
            }

            // Return internal rate of return
            return resultRate;
        };

        this.calculateInitialData = function(property) {
            property.pricePerSqft = property.cost / property.sqft;

            //default to 20%
            property.equityInvestedPercent = property.equityInvestedPercent || 20;
            property.equityInvested = property.cost * (property.equityInvestedPercent / 100);

            //based on sqft for now
            property.avgCompSalePrice = 140 * property.sqft;
            property.debtHeld = property.cost - property.equityInvested;

            //defaults
            property.monthlyRentalRevenue = property.monthlyRentalRevenue || 0;
            property.mortgagePrinciple = property.mortgagePrinciple || 0;
            property.taxes = property.taxes || 0;
            property.insurance = property.insurance || 0;
            property.monthlyRemodelExpense = property.monthlyRemodelExpense || 0;
            property.yearsToHold = 5;

            this.monthlyRevenueChange(property);
        };

        this.changeEquity = function(property) {
            if (property.equityInvestedPercent < 0) {
                property.equityInvestedPercent = 0;
            }
            if (property.equityInvestedPercent > 100) {
                property.equityInvestedPercent = 100;
            }
            property.equityInvested = property.cost * (property.equityInvestedPercent / 100);
            property.debtHeld = property.cost - property.equityInvested;

            this.calculateYearBasedData(property);
        };

        this.changeEquityPercent = function(property) {
            property.equityInvestedPercent = (property.equityInvested / property.cost) * 100;
            property.debtHeld = property.cost - property.equityInvested;
            this.calculateYearBasedData(property);
        };

        this.monthlyRevenueChange = function(property) {
            property.currentRentalRevenue = property.monthlyRentalRevenue * 12;
            //property.projectedMonthlyRentalRevenue = property.units * 1250;
            property.projectedMonthlyRentalRevenue = property.monthlyRentalRevenue * 1.1;
            property.projectedRentalRevenue = property.projectedMonthlyRentalRevenue * 12;

            property.monthlyManagementFee = property.monthlyRentalRevenue * 0.12;
            property.projectedManagementFee = property.projectedMonthlyRentalRevenue * 0.12;

            this.calculateTotalMonthlyProfits(property);
        };

        this.calculateTotalMonthlyProfits = function(property) {
            property.totalCost = property.mortgagePrinciple + property.taxes + property.insurance + property.monthlyRemodelExpense;

            property.currentMonthlyProfit = property.monthlyRentalRevenue - (property.totalCost + property.monthlyManagementFee);
            property.projectedMonthlyProfit = property.projectedMonthlyRentalRevenue - (property.totalCost + property.projectedManagementFee);

            property.currentYearlyProfit = property.currentMonthlyProfit * 12;
            property.projectedYearlyProfit = property.projectedMonthlyProfit * 12;
            this.calculateYearBasedData(property);
        };

        this.calculateYearBasedData = function(property) {
            property.totalValueToAdd = property.monthlyRemodelExpense * 12 * property.yearsToHold;
            property.projectedAmountOfDebt = ((property.mortgagePrinciple * 12) * 0.94) * property.yearsToHold;
            property.projectedProfitAtFinal = (property.avgCompSalePrice * 0.96) - (property.debtHeld - property.projectedAmountOfDebt) - property.equityInvested - property.totalValueToAdd;
            property.exitTotal = property.projectedProfitAtFinal * (1 - 0.12) + property.equityInvested;

            property.projectedReturnsByYear = [property.currentYearlyProfit, property.currentYearlyProfit, property.projectedYearlyProfit, property.projectedYearlyProfit, property.exitTotal];

            var sum = 0;
            var netPresentValue = 0;
            for (var i = 0; i < property.projectedReturnsByYear.length; i++) {
                sum += property.projectedReturnsByYear[i];

                netPresentValue += property.projectedReturnsByYear[i] / (Math.pow(1.05, i + 1));
            }
            netPresentValue -= property.equityInvested;

            property.finalTotal = sum - property.equityInvested;

            property.returnOnInvestmentPercent = Math.round((property.finalTotal / property.equityInvested) * 100);
            property.avgReturnPerYear = sum / property.yearsToHold;

            var irrArray = angular.copy(property.projectedReturnsByYear);
            irrArray.unshift(-1 * property.equityInvested);
            property.irr = Math.round(this.IRR(irrArray) * 100);
            property.netPresentValue = netPresentValue;

            //fix graph
            $timeout(function() {
                property.projectedReturnsByYear = [property.currentYearlyProfit, property.currentYearlyProfit, property.projectedYearlyProfit, property.projectedYearlyProfit, property.exitTotal];
            }, 30);

        };


    });
