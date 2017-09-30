const mongoose = require('mongoose');

mongoose.Promise = Promise;

mongoose.connect('mongodb://127.0.0.1:27017/call_club', {
  useMongoClient: true,
  promiseLibrary: global.Promise
});

const db = mongoose.connection;

db.on('error', (error) => {
  console.log(`数据库创建失败：${error}`);
});

db.on('open', () => {
  console.log('数据库连接成功');
});
