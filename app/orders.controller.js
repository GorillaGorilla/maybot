/**
 * Created by frederickmacgregor on 18/05/2017.
 */
"use strict";


const actions = require('botmaster-fulfill-actions'),
Orders = require('./middlewares');

actions.getOrders = {
    controller : function(params){
        return Orders.getOrdersData(params)
            .then((result)=>{
                console.log("result", result);
                if (!result.length){
                    return "I've checked and tt seems you haven't made any orders yet."
                }
                let text = "Here are the orders:";

                // do something different with thi
                console.log('params.update.message.mid',params.update.message.mid);
                var string = params.update.message.mid.split('.');
                let handleText;
                if (string[1] === "thisisbot"){
                    handleText = (order)=>{
                        let time = Moment(order.createdTime);
                        let deliveryDate = Moment(order.deliveryDate);
                        let newLine = ", a " + order.product + " in size " + order.size + " has been ordered " + time.calendar() + " to arrive by " + deliveryDate.calendar();
                        text += newLine;
                    }
                }else {
                    handleText = (order)=>{
                        let time = Moment(order.createdTime);
                        let deliveryDate = Moment(order.deliveryDate);
                        let newLine = "<pause /> " + "A " + order.product + " in size " + order.size + " has been ordered " + time.calendar() + " to arrive by " + deliveryDate.calendar();
                        text += newLine;
                    };
                }
                text += ". I hope that helps!"

                result.forEach(handleText);
                console.log("get order data text after adds", text);
                return text;
            }).catch((err)=>{
                console.log("getOrdersData err",err);
                return "I've checked and it seems you haven't made any orders yet."
            });
    }
};

actions.getOrderArrivalTime = {
    controller : function (params) {
        return Orders.getOrder(params).then((result)=>{
            console.log("getOrderArrivalTime", result);
            if (!result.length){
                return "Sorry, I looked and couldn't find any orders for a " + params.update.watsonUpdate.context.sku;
            }

            let time = Moment(result[0].deliveryDate);
            let now = Moment();
            let text;
            if (time.isBefore(now)){
                text = "It seems your order should have arrived by now, I would now hand you over to customer support, but this hasn't been implemented yet..."
            }else if(time.isAfter(now)){
                text = "Your order will arrive by " + time.calendar();
            }
            return text;
        }).catch((err)=>{
            console.log("getOrder error", err);
            return "something went wrong I'm afriad."
        })
    }
};

actions.makeOrder = {
    controller : function (params) {
        return Orders.makeOrder(params)
            .then((result)=>{
                console.log("makeOrder result", result);
                return 'and your order number is: ' + result._id;
            }).catch((err)=>{
                return "I'm afraid that didn't work. We didn't put in your order..."
            });
    }
};

module.exports = actions;