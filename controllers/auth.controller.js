const authModel = require('../models/auth.model');

const getLogin = (ctx) => {
    const result = new Promise((resolve, reject) => {
        const { login, password } = ctx.request.query;
        if (!login || !password) {
            resolve({
                'body': 'No request parameters provided',
                'status': 400
            });
            return;
        }
        authModel.login(login, password).then((result) => {
            if (!result) {
                resolve({
                    'token': '',
                    'body': 'Invalid login or password',
                    'status': 401
                });
                return;
            }
            resolve({
                'token': result,
                'body': `Welcome, ${login}`,
                'status': 200
            });
        });
    });
    return result;
};

const checkAuth = (ctx) => {
    const result = new Promise((resolve, reject) => {
        authModel.checkAuth(ctx.session).then((result) => {
            if ("error" in result) {
                resolve({
                    'body': `Unauthorized \n${result.error}`,
                    'status': 401
                });
                return;
            }
            resolve({
                'body': `${result._userID}`,
                'status': 200
            });
        });
    });
    return result;
}

const postLogin = (ctx) => {
    const result = new Promise((resolve, reject) => {
        console.log(ctx.request.body);
        console.log(ctx.request);
        const { username, password } = ctx.request.body;
        if (!username || !password) {
            resolve({
                'body': 'No request parameters provided',
                'status': 400
            });
            return;
        }
        authModel.login(username, password).then((result) => {
            if (!result) {
                resolve({
                    'token': '',
                    'body': 'Invalid login or password',
                    'status': 401
                });
                return;
            }
            resolve({
                'token': result,
                'username': username,
                'body': `Welcome, ${username}`,
                'status': 200
            });
        });
    });
    return result;
}

const getRegister = (ctx) => {
    ctx.body = 'Register page';
    ctx.status = 200;
}

const postRegister = (ctx) => {
    const result = new Promise((resolve, reject) => {
        const { username, password } = ctx.request.body;
        if (!username || !password) {
            ctx.status = 400;
            ctx.body = 'Invalid request';
            return;
        }
        authModel.register(username, password).then((result) => {
            console.log(result);
            if (!result) {
                resolve({
                    'status': 409,
                    'body': 'User already exists'
                });
            }
            resolve({
                'status': 201,
                'username': username,
                'token': result,
                'body': `User ${username} has been registered`
            });
        });
    });
    return result;
}

const authenticate = (ctx) => {
    if (!ctx.session) {
        ctx.status = 401;
        ctx.body = 'Unauthorized #001 \n (no active session)';
        return;
    }
    const token = ctx.session.token;
    if (!token) {
        ctx.status = 401;
        ctx.body = 'Unauthorized #002 \n (no correct seesion token)';
        return;
    }

}

module.exports = {
    getLogin,
    postLogin,
    getRegister,
    postRegister,
    authenticate,
    checkAuth
};