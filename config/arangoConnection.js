var arangojs = require('arangojs');
var Database = arangojs.Database;
var config = require('./config.js')
const db = arangojs(config.database.hostPort);
db.useDatabase(config.database.name);
db.useBasicAuth(config.database.un, config.database.pw);
// test connection
db.get()
.then(info => {
    // the database exists
    console.log(info);
});

module.exports = db;