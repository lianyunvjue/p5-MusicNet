const musicDB = require('../models/db');
const path = require('path');
exports.showIndex = async ctx => {
  let user = ctx.session.user;
  let musics = await musicDB.q('select * from musics where uid = ?',[user.id]);
   //ctx.body = musics;

  ctx.render('index',{
    musics
  });
}

//添加音乐
exports.addMusic = async ctx => {
  // 获取文字数据  和文件数据
  let { title,singer,time} = ctx.request.body; //文字
  // 获取歌词和歌曲的路径(网络)
  let filePath = ctx.request.files.file.path;
  let fileLrcPath = ctx.request.files.filelrc.path;

  // 使用核心对象path 解析,并获取其base属性,  name +ext
  let net_filePath = '/public/files/' + path.parse(filePath).base;
  let net_fileLrcPath = '/public/files/' + path.parse(fileLrcPath).base;
  // 从session中取出uid
  let uid = ctx.session.user.id;
  //将数据保存进数据库
  let result = await musicDB.q('insert into musics (title,singer,time,file,filelrc,uid) values (?,?,?,?,?,?)',[title,singer,time,net_filePath,net_fileLrcPath,uid]);
  console.log(result);
  ctx.body = {
    code:'001',msg:'上传成功'
  }
}
//显示添加音乐
exports.showAddMusic = (ctx)=> ctx.render('add');
