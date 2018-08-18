//构建服务器，配置art-template，路由
const Koa = require ('koa');
const path = require ('path');
const render = require('koa-art-template');
const bodyParser = require('koa-bodyparser');
let app = new Koa();

//引入配置对象
const config = require('./config');

render(app, {
  //配置目录，后缀名，调试模式
  root: path.join(__dirname, 'views'),
  extname: '.html',
  debug: process.env.NODE_ENV !== 'production'//true
});

const router = require('./routes/user_router');

//引入音乐router
const musicRouter = require('./routes/music_router');

//重写url，改掉/public
app.use(async (ctx,next)=>{
  if(ctx.request.url.startsWith('/public') ) {
    ctx.request.url = ctx.request.url.replace('/public',' ');
  }
  await next();
});


//处理静态资源
app.use(require('koa-static')('./public') );

//处理请求体数据 与koa-formidable冲突
//app.use(bodyParser());


// //处理文字和文件的请求体数据
const formidable = require('koa-formidable')
app.use(formidable ( {
  uploadDir:config.uploadDir,
  keepExtensions:true
}));


//处理session
const session = require('koa-session');
app.keys = ['shhhhh'];
//配置session的store
let store = {
  storage:{},
  set:function (key,sess) {
    this.storage[key] = sess;
  },
  get:function (key) {
    return this.storage[key];
  },
  destroy:function(key) {
    delete this.storage[key]
  }
};
app.use(session({store:store},app));

//判断用户是否是登录状态
app.use( async (ctx,next) => {
 let regex = /^\/user/;
 let isNonCheck = regex.test(ctx.request.url);
 if (isNonCheck) return await next();

  if(!ctx.session.user) {
    return ctx.body = `
    <div>
     <a href = "/user/login">没有登录，去登录</a>
    </div>`;
  }
   await next();
});

//挂载了session和判断了权限
app.use(async (ctx,next)=>{
  ctx.state.user = ctx.session.user;
  await next();
});


//将路由对象放入到中间件中
app.use(router.routes() );
app.use(musicRouter.routes() );

//状态码增强 405：url存在请求方式错误 501：copy之类不常见的请求方式， 服务器没有对其处理的
app.use(router.allowedMethods() );
app.use(musicRouter.allowedMethods() );
//开启服务器
app.listen(8888,()=>{
  console.log('服务器启动在8888端口');
});
