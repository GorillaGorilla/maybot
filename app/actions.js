/**
 * Created by frederickmacgregor on 18/05/2017.
 */
"use strict";


const actions = require('botmaster-fulfill-actions');


// leaving this in as an example of how to add a new action that calls mongodb (note mongodb setup is not included in this app).

// const Order = require('mongoose').model('Order')
// function makeOrder(params){
//     console.log("makeOrder", params.update.watsonUpdate.context);
//     let context = params.update.watsonUpdate.context;
//     let time = Moment().add(3, "days");
//
//     let object = {
//         product : context.sku,
//         size : context.size,
//         deliveryDate : time
//     };
//     params.update.watsonUpdate.context.sku = null;
//     params.update.watsonUpdate.context.size = null;
//     console.log("object", object);
//     return Order.create(object);
// }

// actions.makeOrder = {
//     controller : function (params) {
//         return makeOrder(params)
//             .then((result)=>{
//                 console.log("makeOrder result", result);
//                 return 'and your order number is: ' + result._id;
//             }).catch((err)=>{
//                 return "I'm afraid that didn't work. We didn't put in your order..."
//             });
//     }
// };

module.exports = actions;