var _ = require('lodash')
const orderCreated = require('../trigger/order-created')
const orderDeleted = require('../trigger/order-deleted')
const orderStateChanged = require('../trigger/order-state-changed')

nofify = (event, context, callback) => {
    console.log(`Environment Variable -> ' + ${process.env.MAILGUN_KEY}`)
    console.log(`Environment Variable -> ' + ${process.env.MAILGUN_SECRET}`)
    console.log(`Current Time -> ' + ${new Date().toTimeString()}`)
    console.log('Payload from CT SQS -> ' + _.isObject(event) ? JSON.stringify(event) : event)
    console.log(`Payload from CT -> ' + ${event}`)

    event = !_.isObject(event) ? JSON.parse(event) : event
    var ctBody = !_.isObject(event.Records[0].body) ? JSON.parse(event.Records[0].body) : event.Records[0].body
    /* ctBody = _.pick(ctBody, 
                            [
                                'type', 
                                'productProjection', 
                                'removedImageUrls', 
                                'createdAt', 
                                'lastModifiedAt'
                            ]
                        ) */
    console.log('Payload from CT -> ' + _.isObject(ctBody) ? JSON.stringify(ctBody) : ctBody)
    console.log(`Trigger Type = ${ctBody.type}`)
    
    var triggerType = ctBody.type
    notifyUser(triggerType, ctBody)
        .then(response => {
            console.log(`Lambda Response ${response}`)
            response = _.isObject(response) ? response : JSON.stringify(response)
            //callback(null, response)
            callback(null,{
                "statusCode": 200,
                "headers": {
                    "my_header": "my_value"
                },
                "body": JSON.stringify({
                    "message" : "Failed : Body wont have needed attributes to procees"
                }),
                "response" : response,
                "isBase64Encoded": false
            })
        })
        .catch(error => {
            console.log(`Lambda Error ${error}`)
            error = _.isObject(error) ? error : JSON.stringify(error)
            //callback(error, null)
            callback({
                "statusCode": 502,
                "headers": {
                    "my_header": "my_value"
                },
                "body": JSON.stringify({
                    "message" : "Failed : Body wont have needed attributes to procees"
                }),
                "response" : error.message,
                "isBase64Encoded": false
            }, null)
        })
}

notifyUser = (triggerType, eventBody) => {
    return new Promise((resolve, reject) => {
        switch(triggerType) {
            case 'OrderCreated':
                console.log('Inside Order Created')
                orderCreated.notify(eventBody)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
                break;
            case 'OrderDeleted':
                orderDeleted.notify(eventBody)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
                break;
            case 'OrderStateChanged':
                orderStateChanged.notify(eventBody)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
                break;
            default:
                console.log('None of the Trigger Type met')
                reject(new Error('Not a Valid Trigger Type'))
        }
    })
}

module.exports = {
    notify: (event, context, callback) => notify(event, context, callback)
}