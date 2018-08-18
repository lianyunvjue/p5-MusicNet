//配置路由
const Router = require('koa-router');
let userController = require('../controllers/user_controller');
let router = new Router();
//路由规则
//注册页面
router.get('/user/register',ctx => {
  ctx.render('register');
})
.get('/user/login',ctx => {
  ctx.render('login');
})

.post('/user/check-username',userController.checkUsername)//检查用户名是否存在
.post('/user/do-register',userController.doRegiser)
.post('/user/do-login',userController.doLogin)
.get('/user/test-session',userController.test)
.get('/user/get-pic',userController.getPic)
.get('/user/logout',userController.Logout)

//测试
// router.get('/',async ctx =>{
// //使用db.js里面对象的q函数 异步操作
// let db =require('./models/db');
// let users = await db.q('select * from users where id = ?',[1]);
// console.log(users);
// let user = users[0];
//   ctx.render('index',{
//     text:user.username
//   });
// });

module.exports = router;
