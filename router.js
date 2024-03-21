const Router = require('koa-router');
const auth = require('./controllers/auth.controller');
const chat = require('./models/chat.model');
const profile = require('./models/profile.model');
const { koaBody } = require('koa-body');
const router = new Router();
const path = require('path');

// const authModel = require('./models/auth.model');
const koaSend = require('koa-send');


router.use(async (ctx, next) => {
    let n = ctx.session.views || 0;
    ctx.session.views = ++n;
    console.log(`times= ${n}`);

    if (n === 1 && ctx.request.path !== '/welcome') {
        ctx.redirect('/welcome');
    }
    else {
        await next();
    }
});

router.get(/\/.*/, async (ctx, next) => {
    console.log(ctx.request.path);
    await next();
})

router.get(/\.(css|js|png|jpg|jpeg|bmp)$/, async (ctx, next) => {
    const filePath = path.join('public', ctx.request.path);
    console.log(filePath);
    await koaSend(ctx, filePath);
});

router.get('/chatList', async (ctx, next) => {
    console.log('error here router.js: 115');
    await auth.checkAuth(ctx).then(async (result) => {
        console.log(result);
        if (result.status === 401) {
            ctx.redirect('/login');
            ctx.status = result.status;
            return;
        }
        await chat.getChatList(result.body).then((chats) => {

            console.log(chats);
            let chatListParsed = [];
            for (let chat of chats.chatList) {
                let lastMessage = { content: '<i>No messages yet</i>', senderId: '', timestamp: '' };
                if (chat.messages.length !== 0) lastMessage = chat.messages[chat.messages.length - 1];
                let chatParsed = {
                    chatId: chat.chatId,
                    participants: chat.participants,
                    lastMessage: lastMessage.content,
                    lastMessageAuthor: lastMessage.senderId,
                    lastMessageDate: lastMessage.timestamp
                }
                chatListParsed.push(chatParsed);
            }
            const jsonResponse = JSON.stringify({
                username: result.body,
                chats: chatListParsed
            })
            ctx.response.body = jsonResponse;
            ctx.response.status = chats.status;
        });
    });
    // return;
});

router.get('/chat', async (ctx, next) => {
    const query = ctx.request.query;
    // console.log(query);
    if (!query.chatId) {
        ctx.status = 400;
        ctx.body = 'No chatId provided';
        ctx.redirect('/chats');
        return;
    }
    await koaSend(ctx, 'public/chat.html');

    await next();
});



router.get(/\.html$/, async (ctx, next) => {
    console.log(ctx.request.path);
    // Check if the request is for an HTML fil
    // Redirect to a specific URL
    ctx.redirect('/login');
    await next();
});


router.get('/login', async (ctx, next) => {
    await koaSend(ctx, 'public/login.html');
    await next();
});

router.get('/welcome', async (ctx, next) => {
    await koaSend(ctx, 'public/welcome.html');
    // await next();
});

router.post('/login', koaBody({
    multipart: true,
    // formidable: {
    //     uploadDir: __dirname + '/public/img', // directory where files will be uploaded
    //     keepExtensions: true, // keep file extension on upload
    //     multiples: true,
    // },
    formLimit: '5mb',
    urlencoded: true
}), async (ctx, next) => {
    //auth.getLogin(ctx);
    // await next();
    // console.log(ctx.request);
    // const body = ctx.request.body;
    // console.log(body);
    console.log(ctx.request.body);
    console.log(ctx.req.body);
    await auth.postLogin(ctx).then((result) => {
        console.log(result);
        ctx.status = result.status;
        ctx.body = result.body;
        if (result.status === 200) {
            ctx.redirect('/chats');
        }
        ctx.session.token = result.token;
        ctx.session.username = result.username;
    });
});

router.get('/register', async (ctx, next) => {
    await koaSend(ctx, 'public/register.html');
    await next();
});

// router.get('/checkAuth', async (ctx, next) => {
//     await auth.checkAuth(ctx).then((result) => {
//         console.log(result);
//         ctx.status = result.status;
//         if (result.status === 401) {
//             ctx.redirect('/login');
//         }
//         ctx.body = result.body;

//     });
//     await next();
// });

router.post('/register', koaBody({
    multipart: true,
    formidable: {
        uploadDir: __dirname + '/public/img', // directory where files will be uploaded
        keepExtensions: true, // keep file extension on upload
        multiples: true,
    },
    formLimit: '5mb',
    urlencoded: true
}), async (ctx, next) => {
    // auth.postRegister(ctx);

    // console.log(ctx.request);
    // const body = ctx.request.body;
    // console.log(body);
    await auth.postRegister(ctx).then((result) => {
        console.log(result);
        ctx.status = result.status;
        ctx.body = result.body;
        ctx.session.token = result.token;
        ctx.session.username = result.username;
        if (result.status === 201) {
            ctx.redirect('/chats');
        }
        return;
    });
    // await next();
});



router.get('/chats', async (ctx, next) => {
    // await auth.checkAuth(ctx).then((result) => {
    //     console.log(result);
    //     if (result.status === 401) {
    //         ctx.redirect('/login');
    //     };
    //     ctx.status = result.status;
    //     ctx.body = result.body;
    // });
    // await next();

    await koaSend(ctx, 'public/chats.html');
    await next();
});

router.get('/message', (ctx) => {
    ctx.body = 'Message page';

});

router.post('/message', (ctx) => {
    ctx.body = 'Message page';

});

router.put('/message', (ctx) => {
    ctx.body = 'Message page';

});

router.delete('/message', (ctx) => {
    ctx.body = 'Message page';

});

router.get('/profile', (ctx) => {
    ctx.body = 'User page';

});

router.post('/profile', (ctx) => {
    ctx.body = 'User page';

});
router.put('/profile', (ctx) => {
    ctx.body = 'User page';

});

router.get('/profilePic', async (ctx, next) => {
    const query = ctx.request.query;
    if (!query.userID) {
        ctx.status = 400;
        ctx.body = 'No userID provided';
        return;
    }
    await profile.getProfilePic(query.userID).then((result) => {
        console.log(result);
        if (!result) {
            ctx.body = 'img/default.jpeg';
        }
        else {
            ctx.body = `img/${result}`;
        }
        ctx.status = 200;
    });
});

router.post('/profilePic', koaBody({
    formidable: {
        uploadDir: __dirname + '/public/img', // directory where files will be uploaded
        keepExtensions: true, // keep file extension on upload
        multiples: true,
    },
    formLimit: '5mb',
    urlencoded: true,
    multipart: true
}), async (ctx, next) => {
    await auth.checkAuth(ctx).then(async (user) => {
        await profile.editProfilePic(user.body, ctx.request.files.profilePic.newFilename).then((result) => {
            ctx.status = result;
            ctx.body = result === 200 ? 'OK' : 'Error';
        });
    });
    // }, async (ctx) => {
    //     console.log(ctx, ctx.request)
    //     console.log(ctx.request.body, ctx.request.files.file);
    // await auth.checkAuth(ctx).then(async (user) => {
    //     await profile.editProfilePic(user.body, ctx.request.body).then((result) => {
    //         ctx.status = result;
    //         ctx.body = result === 200 ? 'OK' : 'Error';
    //     });
    // });
});

router.delete('/profilePic', (ctx) => {
    ctx.body = 'Image page';

});

router.get('/logout', (ctx) => {
    ctx.session = null;
    ctx.redirect('/login');
});

router.get('/getID', async (ctx, next) => {
    await auth.checkAuth(ctx).then((result) => {
        // console.log(result);
        ctx.status = result.status;
        ctx.body = result.body;
    });
    // await next();
});

router.post('/editUserName', async (ctx) => {
    await auth.checkAuth(ctx).then(async (user) => {
        await profile.editUserName(user.body, ctx.request.body).then((result) => {
            ctx.status = result;
            ctx.body = result === 200 ? 'OK' : 'Error';
        });
    });
});

router.post('/createChat', async (ctx) => {
    const user = await auth.checkAuth(ctx);
    await chat.createChat(ctx.request.body, user.body).then((result) => {
        ctx.status = result ? 200 : 400;
        ctx.body = result;
    });
});


router.get('/', (ctx) => {
    ctx.redirect('/login');
});

router.use(async (ctx, next) => {
    await next();
    await auth.checkAuth(ctx).then((result) => {
        console.log(result);
        if (
            (result.status === 401 || result.status === 404)
            && ctx.request.path !== '/login'
            && ctx.request.path !== '/register') {

            ctx.response.status = 302;
            ctx.response.redirect('/login');
            console.log(ctx.request.path, 'redirected to login');
            return;
        }
        if (result.status === 200 &&
            (ctx.request.path !== '/chats' &&
                ctx.request.path !== '/login' &&
                ctx.request.path !== '/register' &&
                ctx.request.path !== '/chat' &&
                ctx.request.path !== '/socket.io/' &&
                ctx.request.path !== '/welcome')) {
            // ctx.session.token = result.token;
            ctx.redirect('/chats');
            return;
        }
        //ctx.body = result.body;
        //ctx.status = result.status;
    });
});

// router.get(/.*/, (ctx) => {
//     if (ctx.status === 404) {
//         ctx.status = 302;
//         console.log('redirected thorugh *')
//         ctx.redirect('/login');
//     }
// })
module.exports = router;