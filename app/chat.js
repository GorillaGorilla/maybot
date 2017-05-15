/**
 * Created by frederickmacgregor on 11/05/2017.
 */
"use strict";

const Botmaster = require('botmaster');
const SocketioBot = require('botmaster-socket.io');
const botmaster = new Botmaster();
const {fulfillOutgoingWare} = require('botmaster-fulfill');
const actions = require('botmaster-fulfill-actions');
const SessionWare = require('botmaster-session-ware');
const WatsonConversationWare = require('botmaster-watson-conversation-ware');
const Order = require('mongoose').model('Order');
const Moment = require('moment');


const watsonConversationWareOptions = {
    settings: {
        "username": "bdf37df8-81f6-4ddf-bdad-7244c659379e",
        "password": "xrihsXECXbMb",
        version: 'v1', // as of this writing (01 Apr 2017), only v1 is available
        version_date: '2017-02-03', // latest version-date as of this writing
    },
    workspaceId: "206c517d-40a0-4740-8e06-64c0cd91a7ba" // As provided by Watson Conversation
};
const watsonConversationWare = WatsonConversationWare(watsonConversationWareOptions);


const sessionWare = SessionWare();
botmaster.useWrapped(sessionWare.incoming, sessionWare.outgoing);
botmaster.use(watsonConversationWare);
botmaster.use({
    type: 'incoming',
    name: 'my-awesome-middleware',
    controller: (bot, update) => {
        console.log("incoming update.watsonUpdate",update.watsonUpdate);
        // watsonUpdate.output.text is an array as watson can reply with a few
        // messages one after another
        return bot.sendTextCascadeTo(update.watsonUpdate.output.text, update.sender.id);
    }
});

// botmaster.use({
//     type: 'outgoing',
//     name: 'check',
//     controller: (bot, update, message, next) => {
//         console.log('check-ware update.watsonUpdate.output.text', update.watsonUpdate);
//         console.log("findOrders", update.watsonUpdate.intents.find(findOrders));
//         console.log("intents", update.watsonUpdate.intents);
//         function findOrders (intent){
//             return intent.intent === "GET_ORDERS";
//         }
//
//         if (update.watsonUpdate.intents.find(findOrders)){
//             Order.find({}, function(err, data){
//                 if (err){
//                     console.log("error");
//                     update.watsonUpdate.output.text.push("I've just checked but I'm afriad there was an error");
//                     return next();
//                 }else{
//                     console.log("data", data);
//                     if (!data.length){
//                         update.watsonUpdate.output.text.push("I've checked and tt seems you haven't made any orders yet.");
//                         console.log("update.watsonUpdate.output.text", update.watsonUpdate.output.text);
//                         return next();
//
//                     }
//                     update.watsonUpdate.output.text.push("There are some orders, I need to write the code to format them for this bot to say out loud");
//                     return next();
//                 }
//             })
//         }else {
//             next();
//         }
//     }
// });

function getOrdersData(params) {
    // console.log("getOrderData called", params);
    return Order.find({});

}

function getOrder(params){
    let context = params.update.watsonUpdate.context;
    return Order.find({id : context.orderNumber});
}

function makeOrder(params){
    console.log("makeOrder", params.update.watsonUpdate.context);
    let context = params.update.watsonUpdate.context;
    let time = Moment().add(3, "days");

    let object = {
        product : context.sku,
        size : context.size,
        deliveryDate : time
    };
    params.update.watsonUpdate.context.sku = null;
    params.update.watsonUpdate.context.size = null;
    console.log("object", object);
    return Order.create(object);
}

actions.getOrders = {
    controller : function(params){
        return getOrdersData(params)
            .then((result)=>{
            console.log("result", result);
                if (!result.length){
                    return "I've checked and tt seems you haven't made any orders yet."
                }
            let text = "Here are the orders:";
            result.forEach((order)=>{
                let time = Moment(order.createdTime);
                let deliveryDate = Moment(order.deliveryDate);
                let newLine = "<pause /> " + "A " + order.product + "in size " + order.size + " has been ordered at " + time.calendar() + " to arrive by " + deliveryDate.calendar();
                text += newLine;
            });
            console.log("get orderdata text after adds", text);
            return text;
            }).catch((err)=>{
            console.log("getOrdersData err",err);
            return "I've checked and it seems you haven't made any orders yet."
            });
    }
};

actions.getOrderArrivalTime = {
    controller : function () {
        return getOrder(params).then((result)=>{
            let time = Moment(result.deliveryDate);
            let now = Moment();
            if (time.isBefore(now)){
                let text = "It seems your order should have arrived by now, hmm, a member of customer support will help with this."
            }else if(time.isAfter(now)){
                let text = "Your order will arrive by " + time.calendar();
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
        return makeOrder(params)
            .then((result)=>{
            console.log("makeOrder result", result);
            return 'and your order number is: ' + result._id;
            }).catch((err)=>{
            return "I'm afraid that didn't work. We didn't put in your order..."
            });
    }
};

botmaster.use({
    type: 'outgoing',
    name: 'fulfill-middleware',
    controller: fulfillOutgoingWare({actions})
});

module.exports = function(app){
    const socketioSettings = {
        id: '123bot',
        server: app, // this is required for socket.io. You can set it to another node server object if you wish to. But in this example, we will use the one created by botmaster under the hood
    };
    const socketioBot = new SocketioBot(socketioSettings);
    botmaster.addBot(socketioBot);


};

