var mongoose = require('mongoose');
// connect to the database
// var db_url = process.env.MONGODB_URI ||  'mongodb://localhost:27017/sidekick';
// mongodb://sidekick:sidekick2017:@ds113702.mlab.com:13702/sidekick

var keys = require('./keys.js');
var db_url = 'mongodb://' + keys.mongoUser+ ':' + keys.mongoPass + ':@' + keys.mongoHost + ':' + mongoPort + '/' + keys.mongoDatabase;
var connection = mongoose.connect(db_url);
// export the connection
module.exports = connection;

