// connect to the database
var mongoose = require('../config/connection.js');

var Schema = mongoose.Schema;
// create a Schema
var studentSchema = new Schema({

    // focusAreaInfos: {type: Object, required: true},
    // playlists: {type: Object, required: true},
    // items: {type: Object, required: true},
    // id:  {type: Number, required: true},
    name:  {type: String, required: true},
    grade: {type: String, required: true},
    focusArea:  {type: Object, required: true},
    created_at: {type : Date, required : true, default: Date.now}
});

// create a model using this Schema
var Students= mongoose.model('Students', studentSchema);

// export the model
module.exports = Students;

