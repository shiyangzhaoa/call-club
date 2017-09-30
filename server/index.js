const Koa = require('koa');
const koaBody = require('koa-body');
const logger = require('koa-logger')
//用来处理跨域的，前端直接代理就可以了
//const cors = require('koa-cors2');

const routers = require('./routers/index');
require('./db/connect');

const app = new Koa();

//app.use(cors());
app.use(logger());
app.use(koaBody(({ multipart: true })));
app.use(routers.routes()).use(routers.allowedMethods());

app.listen(process.env.PORT || 8080);

console.log('call-club is starting at port 8080');
