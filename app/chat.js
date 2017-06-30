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
const Moment = require('moment'),
    MessengerBot = require('botmaster-messenger'),
    actions = require('botmaster-fulfill-actions');

const messengerSettings = {
    credentials: {
        verifyToken: '83H4guess0ny9me123',
        pageToken: 'EAADg66lOT7cBABXW6EWNp1BvGsKRSFGwzQMtEHH42oonZAMOVHoEkaWtOzgNTfdcSy1dkccy8s0pX4J0m3xv5Q4TxZAhklZAPLxu3PN409dkbmanmVUDk1Vcl749wXHK2pRkZCZCiD03ZAjbDkBRmZA41iLDN5cszYmFcrKstoX1wZDZD',
        fbAppSecret: 'a88b9e873c49e3d63f0387651d8f075f'
    },
    webhookEndpoint: 'webhook'
};

const messengerBot = new MessengerBot(messengerSettings);


const watsonConversationWareOptions = {
    settings: {
        "username": "537368c8-f61b-4372-ac54-a93eddc2c675",
        "password": "Om3Buezrq4Vh",
        version: 'v1', // as of this writing (01 Apr 2017), only v1 is available
        version_date: '2017-02-03' // latest version-date as of this writing
    },
    workspaceId: "440185cd-8e48-4347-8409-b063ea9d1182" // As provided by Watson Conversation
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

    // const actions = require('./orders.controller');


botmaster.use({
    type: 'outgoing',
    name: 'fulfill-middleware',
    controller: fulfillOutgoingWare({actions})
});

    const socketioSettings = {
        id: 'thisBot',
        server: app, // this is required for socket.io. You can set it to another node server object if you wish to. But in this example, we will use the one created by botmaster under the hood
    };
    const socketioBot = new SocketioBot(socketioSettings);
    botmaster.addBot(socketioBot);


};

