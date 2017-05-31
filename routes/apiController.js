
var Course = require('../models/course');
var db = require('../config/arangoConnection.js');
// allows query templates to be used - can pass in variables and reuse.


module.exports = function(app){

    
    // get request from client for grade
    app.get('/focusarea/:year', function(req, res){
        var year = parseInt(req.params.year); 
        // take what we need out 
        Course.find({'focusAreas.focusAreaInfos.courses.gradeLevel': year}).exec(function (err, course) {
            if (err) return console.log(err);
                console.log(course[0]);
                // for now send whole object ignoring actual year requested
                res.json(course[0]);
            })
    })



   
}
