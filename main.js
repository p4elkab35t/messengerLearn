const app = require('./server/app');
const router = require('./router');
const { koaBody } = require('koa-body');
const session = require('koa-session');
const static = require('koa-static');
const initializeChatSocket = require('./controllers/chat.socket');

const http = require("http");

const httpServer = http.createServer(app.callback());
const io = require("socket.io")(httpServer, {
    path: '/chat/socket/'
});

initializeChatSocket(io);

app.keys = ['JadenBlade'];
app.use(koaBody({}));
app.use(session(app));

io.use((socket, next) => {
    let error = null;
    try {
        console.log('socket handshake');
        // create a new (fake) Koa context to decrypt the session cookie
        let ctx = app.createContext(socket.request, new http.OutgoingMessage());
        socket.session = ctx.session;
    } catch (err) {
        console.log('socket handshake failed');
        error = err;
        console.log(err);
    }
    return next(error);
});
app.use(router.routes());
app.use(router.allowedMethods());
app.use(static(__dirname + '/public'));


httpServer.listen(3000);