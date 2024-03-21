// const socketIO = require('socket.io');
const chat = require('../models/chat.model');
const auth = require('../models/auth.model');

const initializeChatSocket = (io) => {
    // const io = socketIO(server, {
    //     path: '/chat'
    // });
    io.on('connection', (socket) => {
        // Join a chat room
        console.log('User connected');
        socket.on('joinChat', ({ chatId }) => {
            socket.join(chatId);
            // console.log('User joined chat:', chatId);
            // console.log('handshake', socket.session);
            // console.log(socket.session.token)
            chat.getChat(socket.session, chatId).then((result) => {
                io.to(chatId).emit('chatData', result);
            })
        });

        // Handle sending a message
        socket.on('sendMessage', async ({ chatId, message }) => {
            const session = socket.session;
            if (!session) {
                console.error('No session found');
                return;
            }
            let senderId;
            if (!session.username) {
                let sender = await auth.checkAuth(session);
                console.log(sender);
                senderId = sender._userID;
            }
            else {
                senderId = session.username;
            }
            console.log('Sending message:', message);
            console.log('Chat ID:', chatId);
            console.log('Sender ID:', senderId);
            try {
                chat.sendMessage(senderId, message, chatId).then((result) => {
                    console.log(result);
                    io.to(chatId).emit('newMessage', { senderId, message });
                });
                // const chatCollection = db.collection('chats');
                // // Add message to the chat document in MongoDB
                // await chatCollection.updateOne({ _id: chatId }, { $push: { messages: { senderId, text: message, createdAt: new Date() } }, $set: { updatedAt: new Date() } });
                // Emit the message to all participants (socket clients) in the room

            } catch (error) {
                console.error('Error sending message:', error);
            }
        });
        socket.on('disconnect', () => {
            console.log('User disconnected');
        });

    });
}

module.exports = initializeChatSocket;