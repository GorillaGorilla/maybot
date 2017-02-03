"use strict";
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var express     = require('express'),
    app         = express(),
    bodyParser = require('body-parser'),
    cfenv = require('cfenv');
// get our request parameters7
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('./public'));

var appEnv = cfenv.getAppEnv();
app.listen(appEnv.port, function(){
    console.log('Server running at port: ' + appEnv.port);
});


module.exports = app;

