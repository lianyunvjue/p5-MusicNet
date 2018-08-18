const user_db = require('../models/db.js');

//module.exports.checkUsername = function(){}
//检查是否有用户名 接收请求，查询数据库，响应数据
exports.checkUsername = async (ctx) => {
let {username} = ctx.request.body;
let users = await user_db.q('select * from users where username = ?',[username]);

if (users.length !== 0) {
  return ctx.body = {  code:'002',msg:'用户名已经存在'  };
}
ctx.body = {code:'001',msg:'可以注册'};
}

//检查是否注册
exports.doRegiser = async ctx =>{
  let { username,password,email,vcode} = ctx.request.body;

  if(vcode != ctx.session.vcode ) {
    return ctx.body = {code:'003',msg:'验证码不正确'};
  }

  let users = await user_db.q('select * from users where username = ? or email = ?',[username,email]);
  let user;
  if (users.length !== 0) {
     if (users.length > 1 ) return ctx.body = {code:'004',msg:'用户名和邮箱都存在'};
    user = users[0];
    if (user.username === username && user.email === email ) return ctx.body = {code:'004',msg:'用户名和邮箱已经存在'};
    if (user.username === username ) return ctx.body = {  code:'002',msg:'用户名已经存在'};
    if (user.email === email ) return ctx.body = {code:'003',msg:'邮箱已经存在'};

  }

  let result = await user_db.q('insert into users (username,password,email) values (?,?,?)',[username,password,email]);
  console.log(result);
  ctx.body = { code:'001',msg:'注册成功'};

}


exports.doLogin = async ctx =>{
  let { username, password, rememberme } = ctx.request.body;

  let users = await user_db.q ('select * from users where username = ?',[username]);
  if (users.length === 0) {
    return ctx.body = {code:'002',msg:'用户名或者密码不正确'};
  }
  let user = users[0];
  if(user.password != password ) {
    return ctx.body = {code:'002',msg:'用户名或者密码不正确'};
  }

  ctx.session.user = user;  //记录这个客户端的登录信息，下次访问也能有信息
   ctx.body = { code:'001',msg:'登录成功'};
  }

exports.test = ctx =>{
 ctx.body = ctx.session.user;
  }

const captchapng = require('captchapng2');
//生成验证码
exports.getPic = ctx =>{
   let rand = parseInt(Math.random() * 9000 + 1000);
   let png = new captchapng(80, 30, rand); // width,height, numeric captcha

   ctx.session.vcode = rand;
   ctx.response.set( 'Content-Type','image/png');
   ctx.body = png.getBuffer();
    }

exports.Logout = ctx =>{
 ctx.session.user = null;
 ctx.response.redirect('/user/login')
  }
