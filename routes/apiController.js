var arangojs = require('arangojs');
var Database = arangojs.Database;
var path = require('path');
var config = require('../config/config.js')
const db = arangojs(config.database.hostPort);
db.useDatabase(config.database.name);
db.useBasicAuth(config.database.un, config.database.pw);
const foxxService = db.route('auth');
// test connection
db.get()
.then(response => {
    // the database exists
    console.log(Date.now() + " Information: Database is Up");
}).catch(err => {
    console.log(Date.now() + " Error: Database is Down.");
});
const aql = arangojs.aql;
module.exports = function(app){

    app.post('/login' , function(req, res, next){
        // console.log(req.body)
        foxxService.post('/login', req.body)
        .then(response => {
            res.json(response.body);
        }).catch(error => {
            // can send error to logs?
            console.log(Date.now() + " Error (Login):", error.response.body.errorMessage);
            // send basic success: false
            // send error to client for handling
            res.json({success:false});
        })
    })
    app.post('/signup' , function(req, res, next){
         console.log(req.body);
        foxxService.post('/signup', req.body)
        .then(response => {
            res.json(response.body);
        }).catch(error => { 
            // can send error to logs?
            console.log(Date.now() + " Error (SignUp):", error.response.body.errorMessage);
            // send basic success: false
            // send error to client for handling
            res.json({success:false});
        })
    })

     app.post("/csv/data", function(req, res, next){
        var studentObj = req.body;
        // save students to database
        var students =  db.collection('students');
        var groups =  db.collection('groups');
        var teacherToGroups = db.edgeCollection('teacherToGroups');
        var groupToStudents = db.edgeCollection('groupToStudents');
        var studentToCurrentFA = db.edgeCollection('studentToCurrentFA');
        students.save(studentObj).then(function(student){
                var students =  student;   // has student id
                 // all dummy ....
                // create a group and get it - use key to make it unique
               
                var newgroupObj = {name: studentObj[0].focusArea + '_' + students[0]._key}
                groups.save(newgroupObj).then(function(groups){
                    // map group to teacher 1 - teachers/1271022
                    teacherToGroups.save({
                        _from: 'teachers/2479769',
                        _to: groups._id
                    }).then(
                        () => console.log("edge created"),
                        err => console.log('Failed to create edge :', err)
                    )
                    // take the first FA
                    let faQuery = studentObj[0].focusArea;
                    // get FA id then do final edge mappings
                    var query = aql`FOR fa in focusAreas FILTER fa["Focus Area"] == ${faQuery} RETURN fa._id`;
                        db.query(query)
                        .then(cursor => {                           
                            // cursor is a cursor for the query result
                                if (cursor._result.length > 0){
                                    var focusArea = cursor._result[0];
                                    for (var i = 0 ; i  < students.length; i++){
                                    groupToStudents.save({
                                        _from: groups._id,
                                        _to: students[i]._id
                                    }).then(
                                        () => console.log("edge created"),
                                        err => console.log('Failed to create edge :', err)
                                    )
                                    // students to fa
                                    studentToCurrentFA.save({
                                        _from: students[i]._id,
                                        _to: focusArea
                                    }).then(
                                        () => console.log("edge created"),
                                        err => console.log('Failed to create edge :', err)
                                    )
                                    
                                }                                    
                             }
                             res.json();
                        });

                    
  
                   

                })

            })


     })
    // route to get all paths
    // using post as passing object - probably not ideal
    app.post('/api/path/all', function (req, res){
        var groups = [];
        let queryStandards = []; 
        let querySubjects = [];
        let queryTopics = []; 
        // some pre-processing to put values names into arrays
        if (req.body.subjects){
            if (req.body.subjects.length > 0){
                for (var i = 0; i < req.body.subjects.length; i++){
                    querySubjects.push(req.body.subjects[i].name);
                }
            }
        }
        if (req.body.standards){
            if (req.body.standards.length > 0){
                for (var i = 0; i < req.body.standards.length; i++){
                    queryStandards.push(req.body.standards[i].name.toUpperCase());
                }
            }
        }
        if (req.body.topics){
            if (req.body.topics.length > 0){
                for (var i = 0; i < req.body.topics.length; i++){
                    // console.log("queryTopics ????", queryTopics, req.body.filter.topics[0].name)
                    queryTopics.push(req.body.topics[0].name.toLowerCase())
                }
            } 
        } 
        let newArr = [];
        groups = req.body.groups;
        console.log(req.body);
    
        var query = aql`for group_id in ${groups} let queryFa = (for v, edge, path in 0..3 outbound group_id groupToStudents, studentToCurrentFA let fa = (for vv in OUTBOUND v studentToCurrentFA  return vv) FILTER LENGTH(fa) != 0 RETURN {_id: fa[0]._id}) let queryGrades = (for v, edge, path in 0..3 outbound group_id groupToStudents FILTER v.grade != null RETURN DISTINCT v.grade) let mainQuery = (for fa, edge, path in 0..999 outbound queryFa[0] thenFocusOn filter length(${querySubjects}) > 0 ? fa.subject in ${querySubjects} : true filter length(queryGrades) > 0 ? TO_ARRAY(fa.grade) any in queryGrades : true filter length(${queryTopics}) > 0 ? fa.topics[* return UPPER(CURRENT)] any in ${queryTopics}[* return UPPER(CURRENT)] : true filter length(${queryStandards}) > 0 ? fa.standardConnections[* return UPPER(CURRENT)] any in ${queryStandards}[* return UPPER(CURRENT)] : true return {focusArea: fa}) RETURN {group: group_id, grades: queryGrades, topics: ${queryTopics}, standards: ${queryStandards}, subjects: ${querySubjects},  results: mainQuery}`; // return grade and groupname too
          console.log(query)
        db.query(query).then(cursor => {
            // cursor is a cursor for the query result
            console.log(cursor._result);
            res.json(cursor._result);          
        });

    })

    app.get('/api/focusarea', function(req, res){
        var query = aql`FOR fa in focusAreas SORT fa["Focus Area"] RETURN {name: fa["Focus Area"], id: fa._id}`;
        db.query(query)
        .then(cursor => {
            // cursor is a cursor for the query result
            res.json(cursor._result);          
        });
    })
    app.get('/api/teacher/group', function(req, res){
        //should pass in teacher id as param but for now it is hardcoded to 'Teacher 1'
        let name = "Teacher 1";
        var query = aql`for v, edge, path in 1..2 outbound (FOR teacher IN teachers FILTER teacher.name == ${name} RETURN teacher._id)[0] teacherToGroups
            SORT v.name
            RETURN { 
            name: v.name,
            _id: v._id
            }`;
                        
        db.query(query)
        .then(cursor => {
            // cursor is a cursor for the query result
            res.json(cursor._result);          
        });    
    })

        app.post("/csv/file", function(req, res, next){
        // main entry point
        // need to verify csv file and save contents somewhere...
        var fileContentsFromBuffer = req.body.buffer.toString('utf-8');
        // split on the carriage return or newline
        var csvToArr = fileContentsFromBuffer.split(/\r|\n/);
        //  need to do for loop over array, split on comma and save
        var studentsArr = [];
        for (var i = 0; i < csvToArr.length; i++) {
            // regex to allow for commas inside ""
            let re = /[ ,]*"([^"]+)"|([^,]+)/g;
            let match;
            let dataArr = [];
            while (match = re.exec(csvToArr[i])) {
                let data = match[1] || match[2];
                dataArr.push(data);
            }
            let studentObj = {
                "id": i,
                "name": dataArr[0],
                "grade": dataArr[1],
                "focusArea": dataArr[2],
            }
            // create array of objects to be saved to database
            studentsArr.push(studentObj);
            if (i >= csvToArr.length-1 ){
                res.json(studentsArr);
            }

        }
 
    })

    app.use(function(req, res){
        // main entry point
        res.sendFile(path.join(__dirname, '/../public/index.html'));
    })
  
}
