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
        console.log(update.watsonUpdate);
        console.log(update.session.watsonContext);
        console.log(update.watson);

        // watsonUpdate.output.text is an array as watson can reply with a few
        // messages one after another
        return bot.sendTextCascadeTo(update.watsonUpdate.output.text, update.sender.id);
    }
});
// botmaster.use('outgoing', fulfillOutgoingWare({
//     actions
// }));

module.exports = function(app){
    const socketioSettings = {
        id: '123bot',
        server: app, // this is required for socket.io. You can set it to another node server object if you wish to. But in this example, we will use the one created by botmaster under the hood
    };



    const socketioBot = new SocketioBot(socketioSettings);
    botmaster.addBot(socketioBot);


};

