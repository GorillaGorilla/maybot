/**
 * Created by frederickmacgregor on 15/05/2017.
 */
"use strict";

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


// different types: when bomb is damages player, when flak is fired, when flak hits?

// when bomber is downed

var OrderSchema = new Schema({
    product: String,
    createdTime: {
        type: Date,
        default: Date.now
    },
    deliveryDate: {
        type: Date,
        default: Date.now
    },
    customer: String,
    size : String
});


mongoose.model('Order', OrderSchema);