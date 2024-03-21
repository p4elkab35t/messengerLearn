const { MongoClient } = require("mongodb");
const crypto = require('crypto');

const uri = "mongodb://127.0.0.1:27017";

const client = new MongoClient(uri);

const login = async (login, password) => {
    try {
        await client.connect();
        const database = client.db('MessengerP4');
        const users = database.collection('Users');
        const query = { _userID: `${login}`, password: `${password}` };
        const user = await users.findOne(query);
        // console.log(user);
        if (!user) return false;
        // console.log('returning user')
        return await updateToken(login);
    } finally {
        await client.close();
    }
}

const register = async (login, password) => {
    try {
        await client.connect();
        const database = client.db('MessengerP4');
        const users = database.collection('Users');
        const query = { _userID: `${login}` };
        const user = await users.findOne(query)
        if (user) return false;
        const newUser = {
            _userID: `${login}`,
            password: `${password}`,
            profilePicture: null,
            _token: null,
            banList: [],
            lastLoginDate: null,
            registerDate: new Date()
        };
        await users.insertOne(newUser);
        const token = await updateToken(login)
        return token;
    } catch (err) {
        console.log(err);

    } finally {
        await client.close();
    }
}

const checkAuth = async (session, connected = false) => {
    try {
        if (!connected) { await client.connect(); }
        const database = client.db('MessengerP4');
        const users = database.collection('Users');
        if (!session.token) return { error: 'no token' };
        // console.log('token is present' + session);

        const query = { _token: `${session.token}` };
        const user = await users.findOne(query);
        // console.log(user._userID);
        if (!user) return { error: 'token is incorrect' };
        return user;
    }
    catch (error) {
        console.log(error);
    } finally {
        if (!connected) { await client.close(); }
    }
}

const updateToken = async (userID) => {
    try {
        await client.connect();
        const database = client.db('MessengerP4');
        const users = database.collection('Users');
        const query = { _userID: `${userID}` };
        const user = await users.findOne(query);
        if (!user) return null;
        console.log('updating token')
        const token = crypto.randomBytes(128).toString('hex');
        if (await users.findOne({ _token: token })) return updateToken(userID);
        await users.updateOne(query, { $set: { _token: token } })
        return token;

    } finally {
        await client.close();
    }

}

module.exports = {
    login,
    register,
    checkAuth
};