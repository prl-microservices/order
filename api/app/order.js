var order = require('../../app/function/gateway/order');
var async = require('async')

module.exports = {
    notification: (req, res, next) => {
        async.waterfall([
            orderAPI = (callback) => {
                order.notify(req.body, null, callback)
            }
        ], (error, response) => {
            if (error) {
                res.status(200).send(error)
            } else {
                res.status(200).send(response);
            }
        })
    }
}