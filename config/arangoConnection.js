var Database = require('arangojs').Database;
var db_login = 'root'; // no need to hide these as they are dummy local values
var db_pwd = 'sidekick'; // no need to hide these as they are dummy local values
var db_url = process.env.ARANGO_URI ||  'http://'+ db_login +':' + db_pwd + '@127.0.0.1:8529';

db = new Database(db_url);
//  db = arango.Connection("http://user:pass@your.host.com/database");
// module.exports = true;
module.exports = db;