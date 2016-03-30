var Receipt = require('./receipt.model');

function getTotal(matchClause, callback) {
    Receipt.aggregate([{
        $match: matchClause
    }, {
        $group: {
            _id: null,
            total: {
                $sum: "$amount"
            }
        }
    }]).exec(function(err, total) {
        if (err) return callback(err);

        return callback(err, total);
    });
}

exports.getTotalReceiptsByType = function(type, callback) {

    var result = {};

    Receipt.aggregate([{
        $match: {
            type: type
        }
    }, {
        $group: {
            _id: "$model_id",
            total: {
                $sum: "$amount"
            },
            description: {
                $first: "$description"
            }
        }
    }, {
        $sort: {
            total: -1
        }
    }]).exec(function(err, propertyReceipts) {
        if (err) return callback(err);

        result.propertyReceipts = propertyReceipts;

        getTotal({
            type: type
        }, function(err, total) {
            if (err) return callback(err);

            result.total = total;

            callback(err, result);
        });
    });
};

function getReceiptsAndRentByQuery(key, value, callback) {
    var result = {};

    var investmentQuery = {
        'type': 'Investment'
    };

    investmentQuery[key] = value;

    var rentQuery = {
        'type': 'Rent'
    };

    rentQuery[key] = value;

    var sort = {
        'createdAt': -1
    };

    var projection = '-stripeCustomerId';

    //get receipts
    Receipt.find(investmentQuery, projection).sort(sort).lean().exec(function(err, receipts) {
        if (err) return callback(err);

        result.receipts = receipts;

        //get the total for receipts
        getTotal(investmentQuery, function(err, total) {
            if (err) return callback(err);

            result.receiptsTotal = total;

            //get rental payments
            Receipt.find(rentQuery, projection).sort(sort).lean().exec(function(err, rentalPayments) {
                if (err) return callback(err);

                result.rentalPayments = rentalPayments;


                //get the total for rental payments
                getTotal(rentQuery, function(err, total) {
                    if (err) return callback(err);

                    result.rentalPaymentsTotal = total;

                    callback(err, result);
                });

            });

        });
    });
}


exports.getTotalReceiptsByUser = function(userId, callback) {
    getReceiptsAndRentByQuery('user_id', userId, function(err, result) {
        if (err) return callback(err);

        callback(err, result);
    });
};

exports.getTotalReceiptsByProperty = function(propertyId, callback) {
    getReceiptsAndRentByQuery('model_id', propertyId, function(err, result) {
        if (err) return callback(err);

        callback(err, result);
    });
};

