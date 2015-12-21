'use strict';

angular.module('preserveusApp')
    .service('InputService', function($q, $http, $localStorage) {

        var states = [{
            "name": "Alaska",
            "abbrev": "AK"
        }, {
            "name": "Alabama",
            "abbrev": "AL"
        }, {
            "name": "American Samoa",
            "abbrev": "AS"
        }, {
            "name": "Arizona",
            "abbrev": "AZ"
        }, {
            "name": "Arkansas",
            "abbrev": "AR"
        }, {
            "name": "California",
            "abbrev": "CA"
        }, {
            "name": "Colorado",
            "abbrev": "CO"
        }, {
            "name": "Connecticut",
            "abbrev": "CT"
        }, {
            "name": "Delaware",
            "abbrev": "DE"
        }, {
            "name": "District of Columbia",
            "abbrev": "DC"
        }, {
            "name": "Federated States of Micronesia",
            "abbrev": "FM"
        }, {
            "name": "Florida",
            "abbrev": "FL"
        }, {
            "name": "Georgia",
            "abbrev": "GA"
        }, {
            "name": "Guam",
            "abbrev": "GU"
        }, {
            "name": "Hawaii",
            "abbrev": "HI"
        }, {
            "name": "Idaho",
            "abbrev": "ID"
        }, {
            "name": "Illinois",
            "abbrev": "IL"
        }, {
            "name": "Indiana",
            "abbrev": "IN"
        }, {
            "name": "Iowa",
            "abbrev": "IA"
        }, {
            "name": "Kansas",
            "abbrev": "KS"
        }, {
            "name": "Kentucky",
            "abbrev": "KY"
        }, {
            "name": "Louisiana",
            "abbrev": "LA"
        }, {
            "name": "Maine",
            "abbrev": "ME"
        }, {
            "name": "Marshall Islands",
            "abbrev": "MH"
        }, {
            "name": "Maryland",
            "abbrev": "MD"
        }, {
            "name": "Massachusetts",
            "abbrev": "MA"
        }, {
            "name": "Michigan",
            "abbrev": "MI"
        }, {
            "name": "Minnesota",
            "abbrev": "MN"
        }, {
            "name": "Mississippi",
            "abbrev": "MS"
        }, {
            "name": "Missouri",
            "abbrev": "MO"
        }, {
            "name": "Montana",
            "abbrev": "MT"
        }, {
            "name": "Nebraska",
            "abbrev": "NE"
        }, {
            "name": "Nevada",
            "abbrev": "NV"
        }, {
            "name": "New Hampshire",
            "abbrev": "NH"
        }, {
            "name": "New Jersey",
            "abbrev": "NJ"
        }, {
            "name": "New Mexico",
            "abbrev": "NM"
        }, {
            "name": "New York",
            "abbrev": "NY"
        }, {
            "name": "North Carolina",
            "abbrev": "NC"
        }, {
            "name": "North Dakota",
            "abbrev": "ND"
        }, {
            "name": "Northern Mariana Islands",
            "abbrev": "MP"
        }, {
            "name": "Ohio",
            "abbrev": "OH"
        }, {
            "name": "Oklahoma",
            "abbrev": "OK"
        }, {
            "name": "Oregon",
            "abbrev": "OR"
        }, {
            "name": "Palau",
            "abbrev": "PW"
        }, {
            "name": "Pennsylvania",
            "abbrev": "PA"
        }, {
            "name": "Puerto Rico",
            "abbrev": "PR"
        }, {
            "name": "Rhode Island",
            "abbrev": "RI"
        }, {
            "name": "South Carolina",
            "abbrev": "SC"
        }, {
            "name": "South Dakota",
            "abbrev": "SD"
        }, {
            "name": "Tennessee",
            "abbrev": "TN"
        }, {
            "name": "Texas",
            "abbrev": "TX"
        }, {
            "name": "Utah",
            "abbrev": "UT"
        }, {
            "name": "Vermont",
            "abbrev": "VT"
        }, {
            "name": "Virgin Islands",
            "abbrev": "VI"
        }, {
            "name": "Virginia",
            "abbrev": "VA"
        }, {
            "name": "Washington",
            "abbrev": "WA"
        }, {
            "name": "West Virginia",
            "abbrev": "WV"
        }, {
            "name": "Wisconsin",
            "abbrev": "WI"
        }, {
            "name": "Wyoming",
            "abbrev": "WY"
        }, {
            "name": "Armed Forces Africa",
            "abbrev": "AE"
        }, {
            "name": "Armed Forces Americas {except Canada}",
            "abbrev": "AA"
        }, {
            "name": "Armed Forces Canada",
            "abbrev": "AE"
        }, {
            "name": "Armed Forces Europe",
            "abbrev": "AE"
        }, {
            "name": "Armed Forces Middle East",
            "abbrev": "AE"
        }, {
            "name": "Armed Forces Pacific",
            "abbrev": "AP"
        }];


        var roles = [{
            role: 'user'
        }, {
            role: 'admin'
        }, {
            role: 'blogger'
        }];

        this.get = function(key, url) {
            var objs = $localStorage[key];
            var deferred = $q.defer();

            if (objs) {
                deferred.resolve(objs);
            } else {
                var request = $http.get(url);
                request.success(function(serverObjs) {
                    $localStorage[key] = serverObjs;
                    deferred.resolve(serverObjs);
                });
            }

            return deferred.promise;
        };

        this.getStates = function() {
            return states;
        };

        this.getRoles = function() {
            return roles;
        };

    });
