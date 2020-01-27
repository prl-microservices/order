var express = require('express');
var app = express();
const port = 3003;
var morgan = require('morgan');
var bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

app.use(morgan((tokens, req, res) => {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms'
    ].join(' ')
  }));

var order = require('./api/router');

app.use('/v1/order', order);

app.listen(port, (err) => {
    if (err) {
        console.error(`Error while connecting ${port}!`)
    } else {
        console.log(`Server started in port ${port}`)
    }
})

module.exports = app;
