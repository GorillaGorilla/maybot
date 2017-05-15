"use strict";

var config = require('./config'),
    mongoose = require('mongoose');
module.exports = function() {
    var db = mongoose.connect(config.db);
    require('../app/order.model');
    return db;
};