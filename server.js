"use strict";

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express     = require('express'),
    app         = express(),
    bodyParser = require('body-parser'),
    cfenv = require('cfenv');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('./public'));



var appEnv = cfenv.getAppEnv();
var server = app.listen(appEnv.port, function(){
    console.log('Server running at port: ' + appEnv.port);
});

require('./app/chat')(server);


module.exports = app;

