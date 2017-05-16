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
const Moment = require('moment'),
    Orders = require('./middlewares');


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
        console.log("incoming update",update);
        // console.log("incoming bot",bot);

        console.log('',update.message.mid);
        // watsonUpdate.output.text is an array as watson can reply with a few
        // messages one after another
        return bot.sendTextCascadeTo(update.watsonUpdate.output.text, update.sender.id);
    }
});



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
                if (update.message.mid === "thisisbot"){
                    let handleText  = (order)=>{
                        let time = Moment(order.createdTime);
                        let deliveryDate = Moment(order.deliveryDate);
                        let newLine = ", a " + order.product + "in size " + order.size + " has been ordered at " + time.calendar() + " to arrive by " + deliveryDate.calendar();
                        text += newLine;
                    }
                }else {
                    let handleText = (order)=>{
                        let time = Moment(order.createdTime);
                        let deliveryDate = Moment(order.deliveryDate);
                        let newLine = "<pause /> " + "A " + order.product + "in size " + order.size + " has been ordered at " + time.calendar() + " to arrive by " + deliveryDate.calendar();
                        text += newLine;
                    };

                }

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
    controller : function () {
        return Orders.getOrder(params).then((result)=>{
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
        return Orders.makeOrder(params)
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

