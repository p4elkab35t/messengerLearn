const { MongoClient } = require("mongodb");
// const crypto = require('crypto');
// const profile = require('./profile.model');
const auth = require('./auth.model');
// const send = require("koa-send");
// const { last } = require("firebase-tools/lib/utils");
// const { get } = require("../router");
const uri = "mongodb://127.0.0.1:27017";


const client = new MongoClient(uri);

const dbName = 'MessengerP4';
const collectionName = 'Chats';

const getChat = async (session, chatId) => {
    try {
        await client.connect();
        const database = client.db(dbName);
        const collection = database.collection(collectionName);
        // console.log(session);
        // const userExt = await profile.ifUserExists(chatterUsername);
        // if (!userExt) return false;
        const userInt = await auth.checkAuth(session);
        // console.log(userInt);
        if (!userInt) return false;
        // if (userInt._userID === userExt) return false;
        const query = {
            chatId: parseInt(chatId),
            participants: userInt._userID
        }
        const chat = await collection.findOne(query);
        // console.log(chat);
        if (chat) return { username: userInt._userID, chatData: chat };
        return false;
        // return createChat(userInt._userID, userExt, collection);
    } finally {
        await client.close();
    }

}

const createChat = async (user1, user2) => {
    try {
        const chatExists = await checkChats(user1, user2);
        if (chatExists) return false;
        const ChatId = await getLastId('chatId') + 1;
        const newChat = {
            chatId: ChatId,
            participants: [`${user1}`, `${user2}`],
            messages: []
        };
        await client.connect();
        const database = client.db(dbName);
        const collection = database.collection(collectionName);

        await collection.insertOne(newChat);
        return ChatId;
    } finally {
        await client.close();
    }
}

const getLastId = async (val) => {
    try {
        await client.connect();
        const database = client.db(dbName);
        const collection = database.collection(collectionName);
        const pipeline = [
            {
                $group: {
                    _id: null,
                    maxValue: { $max: `$${val}` }
                }
            }
        ];
        const result = await collection.aggregate(pipeline).toArray();
        // console.log(result);
        return result.length > 0 ? result[0].maxValue : null;
    } finally {
        await client.close();
    }

}

const sendMessage = async (userId, message, chatID_preparse) => {
    try {
        await client.connect();
        const database = client.db(dbName);
        const chatID = parseInt(chatID_preparse);
        const collection = database.collection(collectionName);
        const query = { chatId: chatID, participants: userId };
        console.log(query);
        const chat = await collection.findOne(query);
        console.log(chat);
        if (!chat) return false;
        const newMessage = {
            messageId: await getLastMessageIdOfChat(collection, chatID) + 1,
            senderId: userId,
            content: message,
            timestamp: new Date()
        };
        await collection.updateOne(query, { $push: { messages: newMessage } });
        return true;
    } catch (error) {
        console.log(error);
    } finally {
        await client.close();
    }
};

const checkChats = async (user1, user2) => {
    try {
        // Connect to the MongoDB cluster
        await client.connect();

        const database = client.db(dbName);
        const collection = database.collection(collectionName);

        const query = {
            participants: { $all: [user1, user2] },
        };

        const result = await collection.find(query).toArray();
        // console.log(result);
        return result.length > 0;
    } finally {
        // Close the connection
        await client.close();
    }
};

const getMongoId = async (collection, chatId) => {
    const query = { chatId: chatId };
    const chat = await collection.findOne(query);
    console.log(chat._id);
    return chat._id;
}


const getLastMessageIdOfChat = async (collection, chatId) => {

    const query = { chatId: chatId };
    const chat = await collection.findOne(query);
    if (!chat) return 0;
    return chat.messages.length > 0 ? chat.messages[chat.messages.length - 1].messageId : 0;

}

const getChatList = async (username) => {
    try {
        await client.connect();
        const database = client.db(dbName);
        const collection = database.collection(collectionName);
        // console.log(username);
        const chatList = await collection.find({ participants: username }).toArray();
        // console.log(chatList);
        return ({ status: 200, chatList: chatList })
    } catch (error) {
        return ({ status: 500, error: error.message });
    } finally {
        await client.close();
    }
}

module.exports = {
    getChatList,
    getChat,
    sendMessage,
    createChat,
    checkChats
};
// getChatList('user1').then((res) => {
//     console.log(res.chatList);
// });

// getLastId().then((res) => {
//     console.log(res);
// });
// createChat('user1', 'p4elkab35t').then(res => console.log(res));

// checkChats('user1', 'p4elkab35t').then((res) => {
//     console.log(res);
// });

// sendMessage('p4elkab35t', 'Hello World!', 2).then((res) => {
//     console.log(res);
// });


// const check = async () => {
//     try {
//         await client.connect();
//         const database = client.db(dbName);
//         const collection = database.collection(collectionName);
//         // const chatExists = await checkChats(user1, user2);
//         const lastId = await getLastMessageIdOfChat(collection, 7) + 1;
//         console.log(lastId);
//     } finally {
//         await client.close();
//     }
// }

// getChat({ token: '534a9d3bf4ed5d5c3ce6c949e3c59631695a0e1ee99b80ff9b10dc65024a0fbb90a1c3e45acdddb3a9cad0b4602d09f9dc74bb50eaa886628d2810a0f4155817457ed116afd6a4ee0a05a206f64284544e962f13582ddcbe4dcc4c309e97a4f1d06687e2a68c588ee8f593e9b6ce087a3ca38ffc35ae9b2783ceeefb642ed646' }, 2).then((res) => {
//     console.log(res);
// });

// check();