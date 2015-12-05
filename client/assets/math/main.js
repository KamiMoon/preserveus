var unique = require('uniq');

var data = [1, 2, 2, 3, 4, 5, 5, 5, 6];

exports.data = data;

exports.sayHello = function() {
    console.log('hi');
};

console.log(unique(data));
