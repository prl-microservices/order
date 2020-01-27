const express = require('express')
var router = express.Router()
var product = require('./app/order')

router.post('/migrate', order.notification)

module.exports = router