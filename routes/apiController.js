
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
.then(err => {
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
    app.get('/api/fa/grades', function(req, res){
        let groups = ['groups/1271115', 'groups/1271134', 'groups/1271087'];
        for (var i = 0; i < groups.length; i++){
            let query = aql`for v, edge, path in 1..3 outbound ${groups[i]} groupToStudents, studentToCurrentFA RETURN v`
            console.log(query);
            db.query(query)
            .then(cursor => {
                // cursor is a cursor for the query result
              resultArr.push(cursor._result);        
            });
        }
    })

    app.get('/api/path/', function(req, res){
        
        // grab input fields from the req.params 
      
        // let standards = req.params.standards;
        // let subjects = req.params.subjects;
        // let topics = req.params.topics;
      
        // get FA and grades based on groups values
        
        let queryFa = 'focusAreas/132901';
        let resultArr = [];
        let queryGrades = [] //e.g., ['9','12'] which you'll have to derive from the student group--what grades are the students in

        console.log(resultArr);
        // let query = aql`for v, edge, path in 1..3 outbound ${groups} groupToStudents, studentToCurrentFA RETURN v`
        // console.log(query);
        // db.query(query)
        // .then(cursor => {
        //     // cursor is a cursor for the query result
        //    console.log(cursor._result);         
        // });
       
       
        // // convert standards to UPPER 
        // let queryStandards = ['CCSS.Math.Content.HSS-MD.A','CCSS.ELA-Literacy.SL.3.2','CCSS.Math.Content.HSN-RN.A.1','CCSS.ELA-Literacy.RI.11-12.1', 'CCSS.ELA-LITERACY.RI.9-10.8','CCSS.ELA-Literacy.RI.11-12.6', 'CCSS.ELA-LITERACY.L.9-10.2']
        // // let queryStandards = ['CCSS.Math.Content.HSS-MD.A'];
        // let querySubjects = ['english'];
        // let queryTopics = []; //e.g., ['immigration','identity'
       
       
        // var query = aql`FOR fa, edge, path IN 1..999 outbound ${queryFa} thenFocusOn
        // filter length(${querySubjects}) > 0 ? fa.subject in ${querySubjects} : true 
        // filter length(${queryGrades}) > 0 ? fa.grade any in ${queryGrades} : true
        // filter length(${queryTopics}) > 0 ? fa.topic any in ${queryTopics} : true 
        // filter length(${queryStandards}) > 0 ? fa.standardConnections any in ${queryStandards} : true 
        // RETURN {focusArea: fa, indexOnPath: length(path.vertices)}`;

        // db.query(query)
        // .then(cursor => {
        //     // cursor is a cursor for the query result
        //     res.json(cursor._result);          
        // });

        


    })

    app.get('/api/teacher/group', function(req, res){
        console.log('/api/teacher/group');
        //should pass in teacher id as param but for now it is hardcoded to 'Teacher 1'
        let name = "Teacher 1";


        // var query = aql`for v, edge, path in 1..2 outbound (FOR teacher IN teachers FILTER teacher.name == ${name} RETURN teacher._id)[0] teacherToGroups, groupToFocusArea, groupToStudents RETURN v`;
        var query = aql`for v, edge, path in 1..2 outbound (FOR teacher IN teachers FILTER teacher.name == ${name} RETURN teacher._id)[0] teacherToGroups
            SORT v.name
            RETURN { 
            name: v.name,
            id: v._id
            }`;
            
        
        db.query(query)
        .then(cursor => {
            // cursor is a cursor for the query result
            var resultsObj = {"groups" : cursor._result};
            var groupsArr = [];
            for (var i=0; i < resultsObj.groups.length; i++){
                groupsArr.push(resultsObj.groups[i].id);
            }
            console.log(groupsArr);
            // var resultsObj = {"groups" : cursor._result};
            //  console.log(resultsObj.groups);
            //   res.json(resultsObj.groups);    
            var query = aql`for v, edge, path in 1..3 outbound ${groupsArr} groupToStudents, studentToCurrentFA RETURN v`;
            db.query(query)
            .then(cursor => {
                console.log(cursor._result);
                resultsObj.fa = cursor._result;
                res.json(resultsObj);    
            })
                  
        });


    })
    



   
}
