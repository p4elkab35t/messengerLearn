const koa = require('koa');
const app = module.exports = new koa();


app.use(async function (ctx, next) {
    try {
        await next();
    } catch (err) {
        throw err;
    }
});

if (!module.parent) app.listen(3000);