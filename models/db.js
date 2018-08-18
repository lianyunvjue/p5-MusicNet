var mysql = require('mysql');
const dbConfig = require('../config').db;

//创建连接池，使用getConnection,释放release
var pool  = mysql.createPool(dbConfig);

let db = {};


//封装了mysql查询的功能
db.q = (sql,params) =>{
  return new Promise((resolve,reject)=>{
    pool.getConnection(function(err, connection) {
    //使用连接  params是数组
    connection.query(sql,params, (error, results)=> {
      // 释放连接.
    connection.release();
     console.log(sql,params,results);

    if (error) return reject (err);
    //成功传递数据
    resolve(results);
    });
   });
  });
}

//到处db对象
module.exports = db;
