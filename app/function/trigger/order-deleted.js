var _ = require('lodash')
var async = require('async')
var mailgunService = require('../../service/mailgunService')

notifyDeletion = (body) => {
    return new Promise((resolve, reject) => {
        async.waterfall([
            // 1. Get required fields from CT response Payload
            CTPayload = (callback) => {
                console.log('Inside CTPayload')
                filterCTPayload(body, callback)
            },
            // 2. Construct Mailgun Payload
            MailgunPayload = (body, callback) => {
                console.log('Inside MailgunPayload')
                constructMailgunPayload(body, callback)
            },
            // 3. Send Mail using Mailgun
            MailgunService = (body, callback) => {
                console.log('Inside ExecuteMailgunService')
                executeMailgunService(body, callback)
                    .then(response => callback(null, response))
                    .catch(error => callback(error, null))
            }
        ], (err, response) => {
            if (err) 
                reject(err)
            else 
                resolve(response)
        })    
    })
}

filterCTPayload = (body, callback) => {
    callback(null, body)
}

constructMailgunPayload = (body, callback) => {
    callback(null, body)
}

executeMailgunService = (body, callback) => {
    try {
        if (!_.isUndefined(body.productProjection)) {
            mailgunService.sendMail(process.env.DRUPAL_PRODUCT_SERVICE_URL, body.productProjection)
                .then(response => callback(null, response))
                .catch(error => callback(null, error))
        } else {
            //throw new Error('Hurrah')
            callback(null, [])
        }
    } catch (error) {
        callback(error, null)
    }
}

module.exports = {
    notify: (body, callback) => notifyDeletion(body)
}