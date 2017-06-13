
// var Course = require('../models/course');
// var db = require('../config/connection.js');
// allows query templates to be used - can pass in variables and reuse.
// const db = require('../config/arangoConnection.js');
var arangojs = require('arangojs');
var Database = arangojs.Database;
var config = require('../config/config.js')
const db = arangojs(config.database.hostPort);
db.useDatabase(config.database.name);
db.useBasicAuth(config.database.un, config.database.pw);
// test connection
db.get()
.then(info => {
    // the database exists
    console.log(info);
});

const aql = arangojs.aql;

module.exports = function(app){

    
    // // get request from client for grade
    // app.get('/focusarea/:year', function(req, res){
    //     console.log("req.params.year", req.params.year);
    //     var year = parseInt(req.params.year); 
    //     // take what we need out 
    //     Course.find({'focusAreas.focusAreaInfos.courses.gradeLevel': year}).exec(function (err, course) {
    //         if (err) return console.log(err);
    //             console.log(course[0]);
    //             // for now send whole object ignoring actual year requested
    //             res.json(course[0]);
    //         })
    // })

    app.get('/api/path', function(req, res){
        // grab these from the req.params 
        // put standards to upper case
        let queryFa = 'focusAreas/132901';
        // convert standards to UPPER 
        let queryStandards = ['CCSS.Math.Content.HSS-MD.A','CCSS.ELA-Literacy.SL.3.2','CCSS.Math.Content.HSN-RN.A.1','CCSS.ELA-Literacy.RI.11-12.1', 'CCSS.ELA-LITERACY.RI.9-10.8','CCSS.ELA-Literacy.RI.11-12.6', 'CCSS.ELA-LITERACY.L.9-10.2']
        // let queryStandards = ['CCSS.Math.Content.HSS-MD.A'];
        let querySubjects = ['english'];
        let queryTopics = []; //e.g., ['immigration','identity'
       
        let queryGrades = [] //e.g., ['9','12'] which you'll have to derive from the student group--what grades are the students in
        var query = aql`FOR fa, edge, path IN 1..999 outbound ${queryFa} thenFocusOn 
        filter length(${querySubjects}) > 0 ? fa.subject in ${querySubjects} : true 
        filter length(${queryGrades}) > 0 ? fa.grade any in ${queryGrades} : true
        filter length(${queryTopics}) > 0 ? fa.topic any in ${queryTopics} : true 
        filter length(${queryStandards}) > 0 ? fa.standardConnections any in ${queryStandards} : true 
        RETURN {focusArea: fa, indexOnPath: length(path.vertices)}`;

        db.query(query)
        .then(cursor => {
            // cursor is a cursor for the query result
            res.json(cursor._result);          
        });

        


    })



   
}
