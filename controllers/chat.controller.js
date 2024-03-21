const chatModel = require('../models/chat.model');
const authModel = require('../models/auth.model');

const getChatList = async (ctx, res) => {
    const username = res.body;
    chatModel.getChatList(username).then((result) => {
        ctx.body = result;
        ctx.status = result.status;
        return result;
    });
};

const getChat = async (ctx, res) => {
    const chatId = res.body;
    chatModel.getChat(ctx.session, ctx.body.username, chatId).then((result) => {
        ctx.body = result;
        ctx.status = result.status;
        return result;
    });
};

const sendMessage = async (ctx, res) => {
    const message = res.body.message;
    const chatId = res.body.chatId
    authModel.checkAuth(ctx.session).then((username) => {
        chatModel.sendMessage(username, message, chatId).then((result) => {
            ctx.body = result;
            ctx.status = result == 200 ? 200 : 500;
            return result;
        });
    });
};

const createChat = async (ctx, res) => {
    const participants = res.body.participants;
    chatModel.createChat(participants).then((result) => {
        ctx.body = result;
        ctx.status = result == 200 ? 200 : 500;
        return result;
    });
};

module.exports = {
    getChatList,
    getChat,
    sendMessage,
    createChat
};
