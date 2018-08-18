const path = require('path');

module.exports = {
  uploadDir:path.join(__dirname,'public/files'),
  db:{
      host            : 'localhost',
      user            : 'root',
      password        : 'root',
      database        : 'node_music'

  }
}
