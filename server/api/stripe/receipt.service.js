var Receipt = require('./receipt.model');

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
        if (err) {
            callback(err);
        }

        result.propertyReceipts = propertyReceipts;

        Receipt.aggregate([{
            $match: {
                type: type
            }
        }, {
            $group: {
                _id: null,
                total: {
                    $sum: "$amount"
                }
            }
        }]).exec(function(err, total) {
            if (err) {
                callback(err);
            }

            result.total = total;

            callback(err, result);
        });
    });
};
