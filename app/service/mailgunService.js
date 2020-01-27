var request = require("request");
const cache = require('memory-cache');
var _ = require('lodash');

exports.sendMail = (serviceUrl, requestPayload) => {
    var options =
    {
        method: 'POST',
        url: serviceUrl,
        headers:
        {
            'cache-control': 'no-cache',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + cache.get('drlToken')
        },
        body: requestPayload,
        json: true
    };
    return new Promise(function (resolve, reject) {
        request(options, function (error, response, body) {
            error = module.exports.parseResponse(error);
            body = module.exports.parseResponse(body);
            if (error) {
                error.requestPayload = requestPayload;
                reject(error);
            } else {
                if(!_.isUndefined(body.key) && !_.isUndefined(body.createdAt))
                    console.log(body.key + '-' + body.createdAt)
                else if(!_.isUndefined(body.sku) && !_.isUndefined(body.createdAt))
                    console.log(body.sku + '-' + body.createdAt)
                else
                    console.log(body)
                body.requestPayload = requestPayload;
                resolve(body);
            }
        })
    })
}