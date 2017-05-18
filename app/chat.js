/**
 * Created by frederickmacgregor on 11/05/2017.
 */
"use strict";


module.exports = function(app){
const Botmaster = require('botmaster');
const SocketioBot = require('botmaster-socket.io');
const botmaster = new Botmaster({server : app});
const {fulfillOutgoingWare} = require('botmaster-fulfill');
const SessionWare = require('botmaster-session-ware');
const WatsonConversationWare = require('botmaster-watson-conversation-ware');
const Order = require('mongoose').model('Order');
const Moment = require('moment'),
    MessengerBot = require('botmaster-messenger');

const messengerSettings = {
    credentials: {
        verifyToken: 'francisfreddiejwdpractice',
        pageToken: 'EAAa9F87vB2QBAJx8NPDmZBOec6J8ABtpd3L437duB5ZAewNrsgKv0etbrFsTX3K3j7E61j6iW3Op4yLTZCZAQxATfYoVYzq8pcZBkLmiqcruDfEfuUbs4Fld4reKNIUzheFZBhnt74xntUXWf5OF5gPmHsavJvbnLTfpY0gZB5ERwZDZD',
        fbAppSecret: '57c5e5ed777c6a2b1cf5ee36d1c035cd',
    },
    webhookEndpoint: 'webhook',
};

const messengerBot = new MessengerBot(messengerSettings);


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
botmaster.addBot(messengerBot);

botmaster.use({
    type: 'incoming',
    name: 'my-awesome-middleware',
    controller: (bot, update) => {
        // console.log("incoming update",update);
        // console.log("incoming bot",bot);

        // console.log('',update.message.mid);
        // watsonUpdate.output.text is an array as watson can reply with a few
        // messages one after another
        return bot.sendTextCascadeTo(update.watsonUpdate.output.text, update.sender.id);
    }
});

    const actions = require('./orders.controller');


botmaster.use({
    type: 'outgoing',
    name: 'fulfill-middleware',
    controller: fulfillOutgoingWare({actions})
});

    const socketioSettings = {
        id: '123bot',
        server: app, // this is required for socket.io. You can set it to another node server object if you wish to. But in this example, we will use the one created by botmaster under the hood
    };
    const socketioBot = new SocketioBot(socketioSettings);
    botmaster.addBot(socketioBot);


};

