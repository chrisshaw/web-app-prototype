var arangojs = require('arangojs');
var Database = arangojs.Database;
var path = require('path');
var dbHostPort = process.env.DB_HOST_PORT || 'http://localhost:8529/';
var dbUser = process.env.DB_USER || 'root';
var dbPwd = process.env.DB_USER || 'sidekick';
var dbName = process.env.DB_NAME || 'skdb';
const db = arangojs(dbHostPort);
db.useDatabase(dbName);
db.useBasicAuth(dbUser, dbPwd);
const foxxService = db.route('auth');


console.log(db);
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
        // fileContentsFromBuffer.replace('\n')
       ;
        // split on the carriage return or newline
        var csvToArr =  fileContentsFromBuffer.replace(/\n/g, '').split(/\r/);
         console.log("csvToArr", csvToArr)        
        //  need to do for loop over array, split on comma and save
        var studentsArr = [];
        // do some basic verification
        // we are expecting 10 fields and we know the first row is headings 
        // process the file
        // start at row 1 cos first row is headings
        if (csvToArr.length < 2) {
            // file contains no data only headers
            // console.log("error length < 2");
            res.json({success: false, error: "File contains no data"}); 
        } else {     
            for (var i = 0; i < csvToArr.length; i++) {          
                // regex to allow for commas inside ""
                let re = /[ ,]*"([^"]+)"|([^,]+)/g;
                let match;
                let dataArr = [];
                while (match = re.exec(csvToArr[i])) {
                    let data = match[1] || match[2];
                    dataArr.push(data);
                }
                // create object to send to client
                let studentObj = {
                        id: i-1,
                        studentId: dataArr[0],
                        firstName: dataArr[1],
                        lastName: dataArr[2],
                        email: dataArr[3],
                        section: dataArr[4],
                        course: dataArr[5],
                        mentor: dataArr[6],
                        faName: dataArr[7],
                        faType: dataArr[8],
                        mastered: dataArr[9]
                }      
                if ((i === 0) && ( dataArr.length < 10)) {
                    console.log("success: false, error: Bad File Format")
                    res.json({success: false, error: "not enough headers"});
                    break; 
                } 
                else if ((i === 0) && ( dataArr.length === 10)) {
                    // verify the headers are correct so we don't save junk
                    if ((dataArr[0] !== "Student ID") 
                    || (dataArr[1] !== "Student First")
                    || (dataArr[2] !== "Student Last")
                    || (dataArr[3] !== "Student Email")
                    || (dataArr[4] !== "Section Name")
                    || (dataArr[5] !== "Course Name")
                    || (dataArr[6] !== "Mentor Name")
                    || (dataArr[7] !== "Focus Area Name")
                    || (dataArr[8] !== "Focus Area Type")
                    || (dataArr[9] !== "Mastered?")) {
                        console.log({success: false, error: "bad headers"});
                        res.json({success: false});
                        break; 
                    } 
                } 
                // create array of objects to be saved to database
                studentsArr.push(studentObj);
                if (i >= csvToArr.length-1 ){
                    // console.log(studentsArr);
                    var resultsObj = {success: true, results: studentsArr }
                    res.json(resultsObj);
                }
            }

        }

 
    })

    app.use(function(req, res){
        // main entry point
        res.sendFile(path.join(__dirname, '/../public/index.html'));
    })
  
}
