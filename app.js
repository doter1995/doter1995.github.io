const Koa = require('koa');

const app = new Koa();
app.use(require('koa-static')('.'));
app.listen(3000);