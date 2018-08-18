const Router = require('koa-router');
let router = new Router();
let musicController = require('../controllers/music_controller');

// 音乐路由
router.get('/music/index',musicController.showIndex ) // 首页
.post('/music/add-music',musicController.addMusic ) //上传音乐
.post('/music/edit-music',musicController.editMusic ) //编辑音乐
.post('/music/del-music',musicController.delMusic  )//删除音乐
.get('/music/add-music',musicController.showAddMusic )    //前端上传音乐
.get('/music/edit-music',musicController.showEditMusic )  //前端编辑音乐
// .get('/music/del-music',musicController.showDelMusic )    //前端删除音乐

module.exports = router;
