const { MongoClient } = require("mongodb");
const crypto = require('crypto');

const uri = "mongodb://127.0.0.1:27017";

const client = new MongoClient(uri);

const dbName = 'MessengerP4';
const collectionName = 'Users';

const ifUserExists = async (username) => {
    try {
        await client.connect();
        const database = client.db(dbName);
        const collection = database.collection(collectionName);
        const query = { _userID: `${username}` };
        const user = await collection.findOne(query);
        if (!user) return false;
        return user._userID;
    } finally {
        await client.close();
    }
};

const getProfilePic = async (username) => {
    try {
        await client.connect();
        const database = client.db(dbName);
        const collection = database.collection(collectionName);
        const query = { _userID: `${username}` };
        const user = await collection.findOne(query);
        if (!user) return false;
        return user.profilePicture;
    } finally {
        await client.close();
    }
};

const editUserName = async (userName, newUserName) => {
    try {
        await client.connect();
        const database = client.db(dbName);
        const collection = database.collection(collectionName);
        const query = { _userID: `${userName}` };
        const newUserNameExists = await collection.findOne({ _userID: `${newUserName}` });;
        if (newUserNameExists) return 400;
        const user = await collection.findOne(query);
        if (!user) return 400;
        const result = await collection.updateOne(query, { $set: { _userID: `${newUserName}` } });
        return result ? 200 : 400;
    } finally {
        await client.close();
    }
};

const editProfilePic = async (username, newPic) => {
    try {
        await client.connect();
        const database = client.db(dbName);
        const collection = database.collection(collectionName);
        const query = { _userID: `${username}` };
        const user = await collection.findOne(query);
        if (!user) return 400;
        const result = await collection.updateOne(query, { $set: { profilePicture: `${newPic}` } });
        return result ? 200 : 400;
    } finally {
        await client.close();
    }
}

module.exports = {
    ifUserExists,
    getProfilePic,
    editUserName,
    editProfilePic
};