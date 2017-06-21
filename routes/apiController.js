
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
    console.log("db", info);
     console.log(err);
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
    // app.get('/api/fa/grades', function(req, res){
    //     let groups = ['groups/1271115', 'groups/1271134', 'groups/1271087'];
    //     for (var i = 0; i < groups.length; i++){
    //         let query = aql`for v, edge, path in 1..3 outbound ${groups[i]} groupToStudents, studentToCurrentFA RETURN v`
    //         console.log(query);
    //         db.query(query)
    //         .then(cursor => {
    //             // cursor is a cursor for the query result
    //           resultArr.push(cursor._result);        
    //         });
    //     }
    // })

    app.post('/api/path/', function(req, res){
        // had to do a post in order to send over object
        // console.log("posted req.body", req.body);
        // grab input fields from the req.params 
      
        // let standards = req.params.standards;
        // let subjects = req.params.subjects;
        // let topics = req.params.topics;
      
        // get FA and grades based on groups values
        
        let queryFa = req.body.faid;
        // let resultArr = [];
        let queryGrades = [];
        let queryStandards = []; //e.g
        let querySubjects = [];
        let queryTopics = []; //e.g., ['immigration','identity'  
        // console.log(resultArr);
        // let query = aql`for v, edge, path in 1..3 outbound ${groups} groupToStudents, studentToCurrentFA RETURN v`
        // console.log(query);
        // db.query(query)
        // .then(cursor => {
        //     // cursor is a cursor for the query result
        //    console.log(cursor._result);         
        // });
        
       
        // // convert standards to UPPER 
        // let queryStandards = ['CCSS.ELA-LITERACY.RI.9-10.8', 'CCSS.ELA-LITERACY.L.9-10.1.A'];
        // let queryStandards = ['CCSS.Math.Content.HSS-MD.A','CCSS.ELA-Literacy.SL.3.2','CCSS.Math.Content.HSN-RN.A.1','CCSS.ELA-Literacy.RI.11-12.1', 'CCSS.ELA-LITERACY.RI.9-10.8','CCSS.ELA-Literacy.RI.11-12.6','CCSS.ELA-LITERACY.L.9-10.2']
        // let queryStandards = ['AP-ENG-LANG.R.3', 'CCSS.ELA-LITERACY.RL.9-10.3'];
        // console.log("submect:", req.body.filter.subjects, req.body.filter.standards, req.body.filter.grades)
        // console.log(req.body, "req.body")
        // if (Object.keys(req.body).length > 0 ){
 
            if (req.body.filter.subjects){
                if (req.body.filter.subjects.length > 0){
                    for (var i = 0; i < req.body.filter.subjects.length; i++){
                        querySubjects.push(req.body.filter.subjects[i].name);
                    }
                }
            }
            if (req.body.filter.standards){
                if (req.body.filter.standards.length > 0){
                    for (var i = 0; i < req.body.filter.standards.length; i++){
                        queryStandards.push(req.body.filter.standards[i].name.toUpperCase());
                    }
                }
            }
            if (req.body.grade){
                // if(req.body.grades.length > 0){
                    // for (var i = 0; i < req.body.grade.length; i++){
                        queryGrades.push(req.body.grade.toString())
                    // }
                // } 
            }
            if (req.body.filter.topics){
                if (req.body.filter.topics.length > 0){
                    for (var i = 0; i < req.body.filter.topics.length; i++){
                        // console.log("queryTopics ????", queryTopics, req.body.filter.topics[0].name)
                        queryTopics.push(req.body.filter.topics[0].name.toLowerCase())
                    }
                } 
            }
            // console.log("queryTopics", queryTopics, req.body.filter.topics[0].name)
            // queryGrades = req.body.filter.subjects.name;  
            var query = aql`FOR fa, edge, path IN 1..999 outbound ${queryFa} thenFocusOn filter length(${querySubjects}) > 0 ? fa.subject in ${querySubjects} : true filter length(${queryGrades}) > 0 ? TO_ARRAY(fa.grade) any in ${queryGrades} : true filter length(${queryTopics}) > 0 ? fa.topic any in ${queryTopics} : true filter length(${queryStandards}) > 0 ? fa.standardConnections any in ${queryStandards} : true RETURN {focusArea: fa, indexOnPath: length(path.vertices)}`;
            console.log(query);
            var resultObj = { "grade":req.body.grade,
                            "initialfa": req.body.faid,
                            "groupid": req.body.group,
                            "groupname":  req.body.groupname}
                             console.log( resultObj);
            db.query(query)
            .then(cursor => {
                // cursor is a cursor for the query result
                resultObj.results = cursor._result;
               
               
                res.json(resultObj);          
            });

        

    })

    // need to reject error too!
    function getgroups(input) {
        return new Promise(function (resolve, reject) {
            var query = aql`for v, edge, path in 1..3 outbound ${input} groupToStudents, studentToCurrentFA RETURN v`;
            resolve(db.query(query));
        });
    }

    app.get('/api/fa/grade/:group/:id/:name', function(req, res){
        var group = req.params.group + "/" + req.params.id;
        var newgroup = group.replace(/[\ ]+[' ]+/g, " "); 
        var groupname = req.params.name;
        var resultObj = {};
        // console.log(newgroup);
        // one query per group to get fa and grade  
        getgroups(newgroup).then((result) => {
            // console.log("grous:", result)
            // console.log("wwant to see this", result._result);
            // hopefully different groups will have different current fa but can handle this scenario in another release
            // console.log("results:", result._result);
            if (result._result.length > 0){
                resultObj.group = newgroup;
                resultObj.groupname = groupname;
                for (var i = 0; i < result._result.length; i++ ){
                    let pos = result._result[i]._id.indexOf('/'); //gives you the numeric index of the symbol
                    let collection = result._result[i]._id.substr(0, pos); //creates a new string starting from the begin
                    console.log(result._result);
                    if (collection === 'students'){
                        // just take first one as should all be same -- at least for now!!
                        
                        resultObj.grade = result._result[i].grade;
                        console.log('collection grade', resultObj.grade);
                    }
                    if (collection === 'focusAreas'){
                          console.log('collection fa', i, collection);
                        // just take first one as should all be same
                        resultObj.faid = result._result[i]._id;
                        console.log('collection fa', resultObj._id);
                    }
                     console.log( resultObj);
                // }
                }
                
            }
            // console.log('result obj', resultObj);
            res.json(resultObj);
        });

    
        // })
    })

    app.get('/api/teacher/group', function(req, res){
        console.log("(in here)")
        // console.log('/api/teacher/group');
        //should pass in teacher id as param but for now it is hardcoded to 'Teacher 1'
        let name = "Teacher 1";
        var query = aql`for v, edge, path in 1..2 outbound (FOR teacher IN teachers FILTER teacher.name == ${name} RETURN teacher._id)[0] teacherToGroups
            SORT v.name
            RETURN { 
            name: v.name,
            id: v._id
            }`;
               
                
        db.query(query)
        .then(cursor => {
               console.log("(in here)", cursor._result)
            // cursor is a cursor for the query result
            res.json(cursor._result);          
        });

       
    })
  
}
