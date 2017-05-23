// connect to the database
var mongoose = require('../config/connection.js');

var Schema = mongoose.Schema;
// create a Schema
var courseSchema = new Schema({

    // focusAreaInfos: {type: Object, required: true},
    // playlists: {type: Object, required: true},
    // items: {type: Object, required: true},
    id:  {type: Number, required: true},
    name:  {type: String, required: true},
    focusAreas:  {type: Object, required: true},
    created_at: {type : Date, required : true, default: Date.now}

});

// create a model using this Schema
var Courses= mongoose.model('Courses', courseSchema);

// export the model
module.exports = Courses;

