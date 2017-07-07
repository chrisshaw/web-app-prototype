var arangojs = require('arangojs');
var Database = arangojs.Database;
var path = require('path');
// var dbHostPort = process.env.DB_HOST_PORT;
// var dbUser = process.env.DB_USER;
// var dbPwd = process.env.DB_PWD;
// var dbName = process.env.DB_NAME;
var dbHostPort = 'http://localhost:8529'
var dbUser = 'root';
var dbPwd = 'sidekick';
var dbName = 'skdb';
const db = arangojs(dbHostPort);
db.useDatabase(dbName);
db.useBasicAuth(dbUser, dbPwd);
const foxxService = db.route('auth');


// console.log(db);
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
            //  console.log('login session', req.session);
            // console.log("login: ", response.headers['set-cookie']);
            // store session token in a cookie on client
            res.setHeader("Set-Cookie",  response.headers['set-cookie']);
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
        //  console.log(req.body);
        foxxService.post('/signup', req.body)
        .then(response => {
           
            // store session token in a cookie on client
            res.setHeader("Set-Cookie",  response.headers['set-cookie']);
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


    function saveStudentGetIds(studentArr, i){
        return new Promise((resolve, reject) => {
            // console.log("studentArr", studentArr);
            // run db query here
            // resve ids and then do update
            // iterative call on this function
            let query =aql`for s in ${studentArr}
            let student_id = (UPSERT{ studentId: s.studentId } INSERT { studentId: s.studentId,firstName: s.firstName,  lastName: s.lastName, email: s.email, mentor:  s.mentor, dateCreated: DATE_NOW() } UPDATE {email: s.email, mentor:  s.mentor } IN students RETURN NEW._id )
            let course_id = (for v in courses Filter v.course == s.course return {_id:v._id, section: s.section})
            let fas = (for fa in s.focusAreas
                let focusArea = (for f in focusAreas filter f["Focus Area"] == fa.faName return f._id)
                return {fa_id: focusArea[0], focusAreaDetails: fa})
            return {student_id: student_id, course_id: course_id,focusArea: fas }`
            // GET DATA --> UPDATE DATA
            // console.log(query)
            db.query(query)
            .then(cursor => {  
                // return the data that contains ids for the next steps
                resolve(cursor._result);
            }).catch(error => {
                reject(error)
            })
        }); 
    }
    // function updateEdgesInactive(response) {
    //      return new Promise((resolve, reject) => {
    //             console.log("fa", response[0][1]['focusArea']);
    //             // let firstUpdateEdges =aql`for s in  ${response[0]}
    //             // for c in takings
    //             //     FILTER c._to == s.course_id[0]._id && c._from == s.student_id[0] && c.active == true
    //             //     UPDATE c with {active: false, dateUpdate:  DATE_NOW()}IN takings
    //             // `;
    //             let firstUpdateEdges =aql`for s in  ${response[0]}
    //             for c in takings
    //                 UPSERT {c._to: s.course_id[0]._id, c._from: s.student_id[0], c.active: true} INSERT {} REPLACE {c._to: s.course_id[0]._id, c._from: s.student_id[0], c.active: false, dateUpdated: DATE_NOW()}
    //             `;

    //             console.log(firstUpdateEdges);
    //             db.query(firstUpdateEdges)
    //             .then(cursor => {      
    //                 // UPDATE
    //                 // let secondUpdateEdges = aql`for s in ${response[0]}
    //                 // for fa in s.focusArea 
    //                 //     for f in hasMastered
    //                 //         FILTER f._to == fa.fa_id && f._from == s.student_id[0] && f.active == true
    //                 //         UPDATE f with {active: false, dateUpdate:  DATE_NOW()}IN studentToCourses`;
    //                 // // console.log(secondUpsert)
    //                 let secondUpdateEdges = aql`for s in ${response[0]}
    //                 for fa in s.focusArea 
    //                     for f in hasMastered
    //                         UPSERT {f._to == fa.fa_id, f._from == s.student_id[0], f.active: true} INSERT {} REPLACE  {f._to == fa.fa_id, f._from == s.student_id[0], f.active: false, dateUpdated: DATE_NOW()}`
    //                 db.query(secondUpdateEdges)
    //                 .then(cursor => {  
    //                     resolve([response[0], response[1]]);
    //                 }).catch(error => {
    //                     reject({success: false})
    //                     console.log(Date.now() + " Error (Update Database 2):", error);
    //                 }) 
    //             }).catch(error => {
    //                 reject({success: false})
    //                 console.log(Date.now() + " Error (Update Database 1):", error);
    //             })
    //      })
    // }
    app.post("/csv/students/courses/data", function(req, res, next){
        // verify user logged in and capture for save...
        let data = req.body;
        var studentObj = {};
        let studentArr = [];
        // start at array position 1 to skip headers
        for (var j = 1; j < data.length; j++){
            if (j === 1){     
                StudentObj = {  
                    studentId: data[j].studentId,
                    firstName: data[j].firstName,
                    lastName: data[j].lastName,
                    email: data[j].email,
                    section: data[j].section,  // assumes one section and course per file
                    course: data[j].course,
                    mentor:  data[j].mentor,
                    focusAreas: [{
                        faName: data[j].faName,
                        faType: data[j].faType,
                        mastered: data[j].mastered,
                    }]
                }
            } else {
                 if(data[j].studentId === data[j-1].studentId){
                        StudentObj.focusAreas.push(
                            {
                                faName: data[j].faName,
                                faType: data[j].faType,
                                mastered: data[j].mastered, 
                            }
                        )
                        if (j === data.length-1){
                            // push final object to array and start again
                            studentArr.push(StudentObj);
                        }
                    //  console.log( StudentObj.focusAreas)
                 } else { 
                     // push existing object to array and start again
                     studentArr.push(StudentObj);
                     // create a new Student Obj
                     StudentObj = {  
                        studentId: data[j].studentId,
                        firstName: data[j].firstName,
                        lastName: data[j].lastName,
                        email: data[j].email,
                        section: data[j].section,  // assumes one section and course per file
                        course: data[j].course,
                        mentor:  data[j].mentor,
                        focusAreas: [{
                            faName: data[j].faName,
                            faType: data[j].faType,
                            mastered: data[j].mastered,
                        }]
                    }
                    if (j === data.length-1){
                        // push final object to array and start again
                        studentArr.push(StudentObj);
                    }
                    // console.log("studentObj", studentObj);
                 }           
            }
        }
        
        // process the data to consolidate it then save to database
        saveStudentGetIds(studentArr).then((response) => {
            console.log(studentArr);
            // filter out rows with null and put these aside for error reporting
            // pre-process: sort out fa_id = null and send to client
            var errorArr = [];
            // save on the object
            for (var i = 0; i < response.length; i++){
                let newFAs = [];
                let nullFAs = [];
                // console.log("response", response[i])
                newFAs =response[i].focusArea.filter((fa) => {          
                    if (fa.fa_id === null){
                        // remove and add to nullFA's array
                        nullFAs.push(fa.focusAreaDetails.faName);
                        return false;
                    }
                    return true;
                })
                response[i].focusArea = newFAs;
                if (nullFAs.length > 0) errorArr.push(nullFAs);
            }
            
            return [response, errorArr]
        }).then((response) => { 
            console.log(response[0])
            // update later to:
            // studentToFA == hasMastered
            // studentToCourse == taking
            // courseToFA == covers
            // inactive old edges
            // updateEdgesInactive(response).then((response) =>{ 
                // ****** add user id as a field saved by to record who made the change
                let firstUpsert = aql`for s in ${response[0]}
                UPSERT { _from: s.student_id[0] , _to: s.course_id[0]._id} INSERT  { _from: s.student_id[0] , _to: s.course_id[0]._id, section: s.course_id[0].section, dateCreated: DATE_NOW() } UPDATE { section: s.course_id[0].section, dateCreated: DATE_NOW()} IN taking RETURN { doc: NEW, type: OLD ? 'update' : 'insert' } `
                db.query(firstUpsert)
                .then(cursor => {  
                    // INSERT
                    let secondUpsert = aql`for s in  ${response[0]}
                    for fa in s.focusArea 
                    UPSERT { _from: s.student_id[0], _to: fa.fa_id} INSERT { _from: s.student_id[0], _to: fa.fa_id, type: fa.focusAreaDetails.faType, mastered: fa.focusAreaDetails.mastered,  dateCreated: DATE_NOW()  } UPDATE { type: fa.focusAreaDetails.faType, mastered: fa.focusAreaDetails.mastered,  dateCreated: DATE_NOW()  } IN hasMastered RETURN { doc: NEW, type: OLD ? 'update' : 'insert' }`;
                    console.log(secondUpsert)
                    db.query(secondUpsert)
                    .then(cursor => {  
                        // console.log("inserted 2:", cursor._result);
                        if (response[1].length > 0 ) {
                            // some FA names were not found in the database
                            res.json({success: false, error: response[1]})
                        } else {
                            // all fields saved
                            res.json({success: true})
                        }
                    }).catch(error => {
                        res.json({success: false})
                        console.log(Date.now() + " Error (Update 2 Database):", error);
                    })  
                // }).catch(error => {
                //     res.json({success: false})
                //     console.log(Date.now() + " Error (Update 1 Database):", error);
                // })  
                    
            }).catch((error)=>{
                console.log(Date.now() + " Error (Getting IDs from Database):", error);
                res.json({success: false})
            })
           
        }).catch((error) => {
            console.log(Date.now() + " Error (Getting IDs from Database):", error);
            res.json({success: false})
        }) 
     })



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
        // remove the newline char then split on the carriage return 
        var csvToArr =  fileContentsFromBuffer.replace(/\n/g, '').split(/\r/);   
        //  need to do for loop over array, split on comma and save
        var studentsArr = [];
        // do some basic verification
        // we are expecting 10 fields and we know the first row is headings 
        // process the file
        // start at row 1 cos first row is headings
        if (csvToArr.length < 2) {
            // file contains no data only headers
            // console.log("error length < 2");
            res.json({success: false, error: ["File contains no data."]}); 
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
                    res.json({success: false, error: ["Insufficient headers"]});
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
                        console.log({success: false, });
                        res.json({success: false, error: ["Header names are incorrect"]});
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
