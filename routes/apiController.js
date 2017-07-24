var arangojs = require('arangojs');
var Database = arangojs.Database;
var path = require('path');
var dbHostPort = process.env.DB_HOST_PORT;
var dbUser = process.env.DB_USER;
var dbPwd = process.env.DB_PWD;
var dbName = process.env.DB_NAME;
// var dbHostPort = 'http://localhost:8529'
// var dbUser = 'root';
// var dbPwd = 'sidekick';
// var dbName = 'skdb';
var dbHostPort = 'http://146.148.55.53:8529/'
var dbUser = 'dbadmin';
var dbPwd = '';
var dbName = 'skdb';
const db = arangojs(dbHostPort);
db.useDatabase(dbName);
db.useBasicAuth(dbUser, dbPwd);
var nodemailer = require("nodemailer");
var path = require('path');
var fs = require('fs');
var fileName = "";
// console.log(db);
// test connection


const aql = arangojs.aql;
module.exports = function(app){

    function saveStudentGetIds(studentArr, username, i){
        return new Promise((resolve, reject) => {
            // username uniquely identifies user / student in auth_users 
            // table but using studentId for students as this identifies them in the school just to be safe
            // these are dummy users so authData = {} - can be promoted later if required by adding authData
            let query =aql`for s in ${studentArr}
            let student_id = (UPSERT{ username: s.email} INSERT { studentId: s.studentId,first: s.firstName,  last: s.lastName, username: s.email, mentor:  s.mentor, school: 'na', role: 'Student', chgPwd: true, active: false, dateCreated: DATE_NOW(),  dateUpdated: null, createdBy: ${username}, updatedBy: null} UPDATE {studentId: s.studentId, mentor:  s.mentor,  dateUpdated: DATE_NOW(),  updatedBy: ${username} } IN auth_users RETURN NEW._id )
            let course_id = (for v in courses Filter v.name == s.course return {_id:v._id, section: s.section})
            let role_id = (for r in auth_roles filter UPPER(r.name) == "STUDENT" return r._id )
            let fas = (for fa in s.focusAreas
                let focusArea = (for f in focusAreas filter f["Focus Area"] == fa.faName return f._id)
                return {fa_id: focusArea[0], focusAreaDetails: fa})
            return {student_id: student_id, role_id: role_id, course_id: course_id,focusArea: fas }`
            // GET DATA --> UPDATE DATA
            db.query(query)
            .then(cursor => {  
                // return the data that contains ids for the next steps
                console.log("what is this", cursor._result)
                resolve(cursor._result);
            }).catch(error => {
                reject(error)
            })
        }); 
    }

    function validateUser(req, res, authPerm) {
        return new Promise( (resolve, reject) => { 
            let cookies = "";
            if (req.cookies) {
                 var cookie = req.cookies['x-foxxsessid'];;
            }
            const foxxService = db.route('auth', {"x-foxxsessid" : cookie});
            foxxService.get('/user')
            .then(response => {
                // if not null
                if (response.body.username){
                    return response.body;
                } else {
                    // if username is null reject
                    reject(response.body.username)
                }
            }).then(response => {
                // get the user permissions and validate against current required permission / action 
                // e.g. manageusers
                let userid = response.userid;
                let username = response.username;
                let query = aql`for u in auth_users for ha in auth_user_hasRole filter ha._from == u._id for ac in auth_roles_can filter ac._from == ha._to for p in auth_permissions filter p._id == ac._to filter u._id == ${userid} return  p.name`;
                db.query(query)
                .then(cursor => {  
                    // validate whether user has required permssion
                    let permissions = cursor._result;
                    console.log(authPerm)
                    console.log(permissions)
                    if ((authPerm !== '' ) && (permissions.indexOf(authPerm) !== -1)) {
                        resolve({success:true, userid: userid, username: username});
                    } else if (authPerm === '' ) {
                        resolve({success:true, userid: userid, username: username});
                    } else {
                        reject();
                    }          
                }).catch(error => {
                    console.log(Date.now() + " Error (Get Perms from Database):");
                    reject();
                }) 
            }).catch(error => {
                console.log(Date.now() + " Error (Get Auth User from Database)");
                reject();
            })
        });      
    }

   function parseFa(result) {
       console.log(result)
        for (var p= 0; p < result.length; p++){
            // console.log("result.fa.length", result.fa.length)
            for (var i = 0; i < result[p].fa.length; i++){
                console.log("result[p].fa.length-1", result[p].fa.length-1)
                if ( i < result[p].fa.length-1) {
                    result[p].fa[i].nextFA = result[p].fa[i+1]['Focus Area']
                } else {
                    result[p].fa[i].nextFA = [];  // if 
                }
                console.log(" result[p].fa[i].nextFA ",  result[p].fa[i].nextFA )
                result[p].fa[i]['currentStd'] = [];
                result[p].fa[i]['nextStd']= [];
                if (i < result[p].fa.length-1){  
                    for (var j = 0; j <  result[p].fa[i+1].standardConnections.length; j++){
                        // save the first one
                        if ((j === 0)){
                            result[p].fa[i].nextStd.push(result[p].fa[i+1].standardConnections[j]);
                        }
                        // don't save duplicates
                        else if ((j > 0 ) && (result[p].fa[i+1].standardConnections[j-1] !== result[p].fa[i+1].standardConnections[j] )){
                            result[p].fa[i].nextStd.push(result[p].fa[i+1].standardConnections[j]);
                        }  
                    }
                }  else {
                    result[p].fa[i].nextStd = [];  // if 
                }

                // de-dup current fa std connections
                for (var k = 0; k < result[p].fa[i].standardConnections.length; k++){
                    if ((k === 0)){
                        result[p].fa[i]['currentStd'].push(result[p].fa[i].standardConnections[k]);
                    }
                    else if ((k > 0 ) && (result[p].fa[i].standardConnections[k-1] !== result[p].fa[i].standardConnections[k] )){
                    result[p].fa[i]['currentStd'].push(result[p].fa[i].standardConnections[k]);
                    }                 
                }
            }
        }
        return result;
    }

    app.post('/password' , function(req, res, next){
        // validate user is logged in
        validateUser(req, res, "").then((response) =>{
            // user is logged in so we can reset their password
            // username etc is extracted from the session in the foxx service
            let cookies = "";
            if (req.cookies) {
                 var cookie = req.cookies['x-foxxsessid'];;
            }
            const foxxService = db.route('auth', {"x-foxxsessid" : cookie});
            foxxService.post('/password', req.body)
            .then(function(response){
                // expect success: true
                console.log(response.body)
                res.json(response.body)
            }).catch(error => { 
                console.log(Date.now() + " Error (Change Password):", error.response.body.errorMessage);
                var msg = error.response.body.errorMessage;
                if ( error.response.body.errorMessage.includes('fails to match the required pattern')) {
                    msg = "Password must be at least 8 CHARS, have at least 1 CAPITAL LETTER and 2 NUMBERS."
                } 
                res.json({success:false, msg: msg })
            })
        })
        .catch(error => { 
            // can send error to logs?
            console.log(Date.now() + " Error (Change Password):", error.response.body.errorMessage);
            // send basic success: false
            // send error to client for handling
            res.json({success:false, auth: false, msg: error.response.body.errorMessage});
        })
    })

    app.post('/login' , function(req, res, next){
        const foxxService = db.route('auth');
        foxxService.post('/login', req.body)
        .then(response => {
            res.setHeader("Set-Cookie",  'x-foxxsessid='+response.headers['x-foxxsessid']);
            return response.body;
        }).then(response => {
            // get user role and perms
            let userid = response.userid;
            let chgPwd = response.chgPwd;
            let username = response.username;
            // let query = aql`for u in auth_users for ha in auth_user_hasRole filter ha._from == u._id for ac in auth_roles_can filter ac._from == ha._to for p in auth_permissions filter p._id == ac._to filter u._id == ${userid} return  p.name`;
            let query = aql`FOR a IN outbound ${userid}
            auth_user_hasRole
            let perms = (for p in outbound a auth_roles_can
                filter p._from == a._to return p.name)
            return { role: a.name, perms: perms}`;
            db.query(query)
            .then(cursor => {  
                // send permissions list back to requesting client function
                // for updating in redux store
                // admin created users must change password on first login  
                res.json({success:true, username: username, role: cursor._result[0].role, perms: cursor._result[0].perms, chgPwd: chgPwd});
            }).catch(error => {
                console.log(Date.now() + " Error (Get Perms from Database):", error);
                res.json();
            }) 
        }).catch(error => {
            // can send error to logs?
            console.log(Date.now() + " Error (Login):", error.response.body.errorMessage);
            // send basic success: false
            // send error to client for handling
            res.json({success:false});
        })
    })
    app.post('/signup' , function(req, res, next){
        // verify user is valid and then that they have the right permissions
        validateUser(req, res, "manageusers").then((response) =>{
            // double check user perms on server side
            // if user has the required permission manageusers in their permissions array in
            // req.perms
            let userObj = req.body;
            // get perms and username of person doing the signup
            let username = response.username;
            userObj.createdBy = username;
            // post/save data using foxx service for auth
            const foxxService = db.route('auth');
            foxxService.post('/signup', userObj)
            .then(function(response){
                // create a user to role mapping.....
                // get userid of person being the signed up
                let userid = response.body.userid;
                let role = req.body.role;    
                let active = true;     // user will be allowed to login and have authData, dummy student users will be active = false and not have any authData
                let query=aql`let userid = ${userid} 
                                let role = (for a in auth_roles 
                                    filter UPPER(a.name) == UPPER(${role})
                                    return {_id: a._id})
                        UPSERT { _from: ${userid} , _to: role[0]._id} INSERT { _from:  ${userid} , _to: role[0]._id, active: ${active}, dateCreated: DATE_NOW(), dateUpdated: null, createdBy:  ${username} , updatedBy: null } UPDATE {  dateUpdated: DATE_NOW(), updatedBy:  ${username} } IN auth_user_hasRole RETURN { doc: NEW, type: OLD ? 'update' : 'insert' }`     
                db.query(query)
                .then(cursor => {  
                    res.json({success: true})
                }).catch(error => {
                    console.log(error);
                    res.json({success: false, msg: error.response.body.errorMessage})
                })
            })
            .catch(error => { 
                // can send error to logs?
                console.log(Date.now() + " Error (SignUp):", error.response.body.errorMessage);
                // send basic success: false
                // send error to client for handling
                res.json({success:false, auth: false, msg: error.response.body.errorMessage});
            })
        })
    })
    app.post("/csv/students/courses/data", function(req, res, next){
        // validate user before save and use name in save
        // username is null if no valid user
        validateUser(req, res, "uploadstudents").then((response) =>{
            // double check user perms on server side
            // if user has the required permission managestudents in their permissions array in
            // req.perms
            let username = response.username;
            // if username not null ie. reponse.
            if (username){
                // verify user logged in and capture for save...
                // console.log(req.body);
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
                saveStudentGetIds(studentArr, username).then((response) => {
                    // filter out rows with null and put these aside for error reporting
                    // pre-process: sort out fa_id = null and send to client
                    var errorArr = [];      
                    // save on the object
                    for (var i = 0; i < response.length; i++){
                        let newFAs = [];
                        let nullFAs = [];
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
                        // get distinct
                    }

                    return [response, errorArr]
                }).then((response) => { 
                    // map new student to role STUDENT in the auth_user_hasRole edge
                    let roleUpsert = aql`for s in ${response[0]}
                        UPSERT { _from: s.student_id[0], _to: s.role_id[0]} INSERT { _from: s.student_id[0], _to: s.role_id[0],  dateCreated: DATE_NOW(), dateUpdated: null, createdBy: ${username} , updatedBy: null } UPDATE {} IN auth_user_hasRole RETURN { doc: NEW, type: OLD ? 'update' : 'insert' }`;
                        db.query(roleUpsert)
                        .then(cursor => {  
                            // console.log("inserted 2:", cursor._result);
                            // update later to:
                            // studentToFA == hasMastered
                            // studentToCourse == taking  == inCourse  == hasCourse (latest)
                            // courseToFA == covers
                            let courseUpsert = aql`for s in ${response[0]}
                            UPSERT { _from: s.student_id[0] , _to: s.course_id[0]._id} INSERT  { _from: s.student_id[0] , _to: s.course_id[0]._id, section: s.course_id[0].section, dateCreated: DATE_NOW(), dateUpdated:  null, createdBy: ${username}, updatedBy: null} UPDATE { section: s.course_id[0].section,  dateUpdated: DATE_NOW(), updatedBy: ${username}} IN hasCourse RETURN { doc: NEW, type: OLD ? 'update' : 'insert' } `
                            db.query(courseUpsert)
                            .then(cursor => {  
                                // console.log("inserted 1:", cursor._result);
                                // INSERT 
                                // remove any fa where hasMastered != "FALSE"
                                let masteredUpsert = aql`for s in  ${response[0]}
                                for fa in s.focusArea 
                                FILTER UPPER(fa.focusAreaDetails.mastered) == 'TRUE'
                                UPSERT { _from: s.student_id[0], _to: fa.fa_id} INSERT { _from: s.student_id[0], _to: fa.fa_id, type: fa.focusAreaDetails.faType, mastered: UPPER(fa.focusAreaDetails.mastered),  dateCreated: DATE_NOW(), dateUpdated: null, createdBy: ${username} , updatedBy: null } UPDATE { type: fa.focusAreaDetails.faType, mastered: UPPER(fa.focusAreaDetails.mastered),  dateUpdated: DATE_NOW(), updatedBy: ${username}  } IN hasMastered RETURN { doc: NEW, type: OLD ? 'update' : 'insert' }`;
                                db.query(masteredUpsert)
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
                            }).catch((error)=>{
                                console.log(Date.now() + " Error (Getting IDs from Database):", error);
                                res.json({success: false})
                            })  

                        }).catch(error => {
                            res.json({success: false})
                            console.log(Date.now() + " Error (Update Role Database):", error);
                    }) 


                        
                }).catch((error) => {
                    console.log(Date.now() + " Error (Getting IDs from Database):", error);
                    res.json({success: false})
                }) 
            } else {
                res.json({success: false})
            }
        }).catch((error) => {
            console.log(Date.now() + " Authentication Error");
            res.json({success: false, auth: false})
        })
    })


    
    // using post as passing object - probably not ideal
    app.post('/api/path/all', function (req, res){
        validateUser(req, res, "buildpath").then((response) =>{
            // intialise
            let queryCourses = [];
            let queryGrades = [];
            let queryStandards = []; 
            let querySubjects = [];
            let queryTopics = []; 
            let studentUserArr = [];
            let studentUser = "";
            // if the user is a student they should only see their own path returned for their courses
            if (req.body.role.toUpperCase() === 'STUDENT'){
                console.log(response.userid)
                studentUserArr.push(response.userid);
                studentUser = response.userid;
            }
            // some pre-processing
            if (req.body.courses){
                if (req.body.courses.length > 0){
                    for (var i = 0; i < req.body.courses.length; i++){
                        console.log(req.body.courses[i]._key);
                        queryCourses.push(req.body.courses[i]._key);  // changed from name to use key
                    }
                }
            }
            console.log("queryCourses", queryCourses)

            if (req.body.grades){
                if (req.body.grades.length > 0){
                    for (var i = 0; i < req.body.grades.length; i++){
                        queryGrades.push(req.body.grades[i].name);
                    }
                }
            }
            // some pre-processing to put values names into arrays
            if (req.body.subjects){
                if (req.body.subjects.length > 0){
                    for (var i = 0; i < req.body.subjects.length; i++){
                        querySubjects.push(req.body.subjects[i].name.toUpperCase());
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
                        queryTopics.push(req.body.topics[0].name.toUpperCase()) // changed from toLowerCAse
                    }
                } 
            } 
            // var query=aql`let topicalFas=LENGTH(${queryTopics}) == 0 ? [] : UNIQUE(FLATTEN(
            //                 for p in projects
            //                 filter p.topics[* return UPPER(CURRENT)] any in ${queryTopics}[* return UPPER(CURRENT)]
            //                     for fa in
            //                     2 outbound p
            //                     alignsTo, addressedBy
            //                     return fa._key
            //             ))
            //             let courseFas = LENGTH(${queryCourses}) == 0 ? [] : UNIQUE(FLATTEN(
            //                 for c in courses
            //                 filter UPPER(c.name) in ${queryCourses}
            //                     for fa in
            //                     outbound c
            //                     covers
            //                     return fa._key
            //             ))
            //             let queryStudents = UNIQUE(FLATTEN(
            //                 for c in courses
            //                             filter LENGTH(${queryCourses}) > 0 ? UPPER(c.name) in ${queryCourses} : true  
            //                                 for student
            //                                 in inbound c
            //                                 hasCourse 
            //                                 filter LENGTH(${queryGrades}) > 0 ? student.grade in ${queryGrades} : true 
            //                                 for role
            //                                     in outbound student._id
            //                                     auth_user_hasRole 
            //                                     filter UPPER(role.name) == 'STUDENT'
            //                                 return student._id
            //             ))
            //             let starters = (
            //                 for fa in focusAreas
            //                 let priors = (
            //                     for v
            //                     in inbound fa
            //                     thenFocusOn
            //                     return 1
            //                 )
            //                 filter LENGTH(priors) == 0
            //                 return fa._id
            //             )
            //             for student in queryStudents
            //                 let masteredFas = (
            //                     FOR fa
            //                     IN outbound student
            //                     hasMastered
            //                     return fa._key
            //                 )
            //                 let StudentDetails = (for s in auth_users filter s._id == student return { first: s.first, last: s.last, id: s.studentId})
            //                 let path  = (
            //                     for start in starters
            //                         for fa
            //                         in 0..999 outbound start
            //                         thenFocusOn
            //                         filter length(${querySubjects}) > 0 ? UPPER(fa.subject) in ${querySubjects} : true
            //                         filter length(topicalFas) > 0 ? fa._key in topicalFas : true
            //                         filter length(courseFas) > 0 ? fa._key in courseFas : true
            //                         filter length(masteredFas) > 0 ? fa._key not in masteredFas : true
            //                         filter length(${queryStandards}) > 0 ? fa.standardConnections[* return UPPER(CURRENT)] any in ${queryStandards}[* return UPPER(CURRENT)] : true
            //                         return fa
            //                 )
            //             return {student: student, details: StudentDetails, fa: path}`;
            var query = aql`
                let topicalFas = LENGTH(${queryTopics}) == 0 ? [] : UNIQUE(FLATTEN(
                    for p in projects
                    filter p.topics[* return UPPER(CURRENT)] any in ${queryTopics}[* return UPPER(CURRENT)]
                        for fa in
                        2 outbound p
                        alignsTo, addressedBy
                        return fa._key
                ))

                let courseFas = LENGTH(${queryCourses}) == 0 ? [] : UNIQUE(FLATTEN(
                    for c in courses
                    filter c._key in ${queryCourses}
                        for fa in
                        outbound c
                        covers
                        return fa._key
                ))

                let queryStudents = LENGTH(${studentUserArr}) > 0 ? (for student in auth_users filter student._id == ${studentUser} return {_id: student._id, _key: student._key,  first: student.first, last: student.last}) : UNIQUE(FLATTEN(
                    for c in courses
                                filter LENGTH(${queryCourses}) > 0 ? c._key in ${queryCourses} : true  
                                    for student
                                    in inbound c
                                    hasCourse 
                                    filter LENGTH(${queryGrades}) > 0 ? student.grade in ${queryGrades} : true 
                                    for role
                                        in outbound student._id
                                        auth_user_hasRole 
                                        filter UPPER(role.name) == 'STUDENT'
                                    return {_id: student._id, _key: student._key,  first: student.first, last: student.last}
                ))

                let starters = (
                    for fa in focusAreas
                    let priors = (
                        for v
                        in inbound fa
                        thenFocusOn
                        return 1
                    )
                    filter LENGTH(priors) == 0
                    return fa._id
                )

                // Main path query
                for student in queryStudents

                let masteredFas = (
                    FOR fa
                    IN outbound student
                    hasMastered
                    return fa._key
                )

                let path  = (
                    for start in starters
                        for fa
                        in 0..999 outbound start
                        thenFocusOn
                        filter length(${querySubjects}) > 0 ? UPPER(fa.subject) in ${querySubjects} : true
                        filter length(topicalFas) > 0 ? fa._key in topicalFas : true
                        filter length(courseFas) > 0 ? fa._key in courseFas : true
                        filter length(masteredFas) > 0 ? fa._key not in masteredFas : true
                        filter length(${queryStandards}) > 0 ? fa.standardConnections[* return UPPER(CURRENT)] any in ${queryStandards}[* return UPPER(CURRENT)] : true
                        return fa
                )

                return {student: student, fa: path}`
            // console.log(query);
            db.query(query).then(cursor => {
                // cursor is a cursor for the query result
                // console.log(cursor._result)  // just the first one for testing only
                // reformat results for  easy client display 

                var studentPathArr = [];
                //  console.log(cursor._result)
            
                var studentArr = Array.from(cursor._result);
                // var studentArr = cursor._result;
                // for each student
               
                    // for each focus area
                    // console.log("student", cursor._result[p].student)

                    // for (var i = 0; i < cursor._result[p].fa.length; i++){
                    //     // console.log(i)
                    //     // console.log(cursor._result[p].fa[i])
                    //     // console.log("fa length", cursor._result[p].fa.length)
                    //     if ( i < cursor._result[p].fa.length-1) cursor._result[p].fa[i].nextFA = cursor._result[p].fa[i+1]['Focus Area'];
                    //     cursor._result[p].fa[i]['currentStd'] = [];
                    //     cursor._result[p].fa[i]['nextStd']= [];
                    //     if (i < cursor._result[p].fa.length-1){  
                    //         for (var j = 0; j < cursor._result[p].fa[i+1].standardConnections.length; j++){
                    //             // save the first one
                    //             if ((j === 0)){
                    //                 cursor._result[p].fa[i].nextStd.push(cursor._result[p].fa[i+1].standardConnections[j]);
                    //             }
                    //             // don't save duplicates
                    //             else if ((j > 0 ) && (cursor._result[p].fa[i+1].standardConnections[j-1] !== cursor._result[p].fa[i+1].standardConnections[j] )){
                    //                 cursor._result[p].fa[i].nextStd.push(cursor._result[p].fa[i+1].standardConnections[j]);
                    //             }  
                    //         }
                    //     }
                
                    //     // de-dup current fa std connections
                    //     for (var k = 0; k < cursor._result[p].fa[i].standardConnections.length; k++){
                    //         if ((k === 0)){
                    //             cursor._result[p].fa[i]['currentStd'].push(cursor._result[p].fa[i].standardConnections[k]);
                    //         }
                    //         else if ((k > 0 ) && (cursor._result[p].fa[i].standardConnections[k-1] !== cursor._result[p].fa[i].standardConnections[k] )){
                    //             cursor._result[p].fa[i]['nextStd'].push(cursor._result[p].fa[i].standardConnections[k]);
                    //         }                 
                    //     }
                    //     // console.log(cursor._result[p].fa[i])
                    // }

                

                
                res.json(parseFa(cursor._result));  
        //  
                
                // res.json(pathArr);          
            }).catch((error => {
                console.log(Date.now() + " Error (Getting paths from Database):", error);
                res.json();
            }))
        }).catch((error) => {
             console.log(Date.now() + " Authentication Error");
             res.json({success: false, error: "No Permissions to View Paths"})
        })
    })

 
    app.post("/csv/file", function(req, res, next){
        validateUser(req, res, "uploadstudents").then((response) =>{
            // main entry point
            // need to verify csv file and save contents somewhere...
            var fileContentsFromBuffer = req.body.buffer;
            // remove the newline char then split on the carriage return 
            // some csv files have /r some have  /r/n
            // replace any /r with /n - the remove duplicates i.e. /n/n
            var fileContent1 = fileContentsFromBuffer.replace(/\r/g, "\n");
            var csvToArr = fileContent1.replace(/\n\n/g, "\n").split(/\n/);
            // var csvToArr =  fileContent2.split(/\n/);   
            //  need to do for loop over array, split on comma and save
            var studentsArr = [];
            // do some basic verification
            // we are expecting 10 fields and we know the first row is headings 
            // process the file
            // start at row 1 cos first row is headings
            if (csvToArr.length < 2) {
                // file contains no data only headers
                res.json({success: false, error: ["File contains no data."]}); 
            } else {     
                for (var i = 0; i < csvToArr.length; i++) {    
                    // skip over any trailing empty lines   
                    if (csvToArr[i] !== ''){
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
                            console.log(Date.now(), " Error: Bad File Format")
                            res.json({success: false, error: ["Missing headers or bad file format - must be csv format."]});
                            break; 
                        } 
                        else if ((i === 0) && ( dataArr.length === 10)) {
                            // verify the headers are correct so we don't save junk
                            if ((dataArr[0].trim().toUpperCase() !== "STUDENT ID") 
                            || (dataArr[1].trim().toUpperCase() !== "STUDENT FIRST")
                            || (dataArr[2].trim().toUpperCase() !== "STUDENT LAST")
                            || (dataArr[3].trim().toUpperCase() !== "STUDENT EMAIL")
                            || (dataArr[4].trim().toUpperCase() !== "SECTION NAME")
                            || (dataArr[5].trim().toUpperCase() !== "COURSE NAME")
                            || (dataArr[6].trim().toUpperCase() !== "MENTOR NAME")
                            || (dataArr[7].trim().toUpperCase() !== "FOCUS AREA NAME")
                            || (dataArr[8].trim().toUpperCase() !== "FOCUS AREA TYPE")
                            || (dataArr[9].trim().toUpperCase() !== "MASTERED?")) {
                                console.log(Date.now(), " Error: Header names are incorrect");
                                res.json({success: false, error: ["Header names are incorrect"]});
                                break; 
                            } 
                        } 
                        // pre-format - create array of objects to be saved to database
                        studentsArr.push(studentObj);
                    } 
                }
                // send results back to client
                var resultsObj = {success: true, results: studentsArr }
                res.json(resultsObj);
                // }
            }
        }).catch((error) => {
             console.log(Date.now() + " Authentication Error");
             res.json({success: false, error: "No Permissions to Upload file"})
        })
    })

    function sendToSummitEmail(email, filePath) {
        // this part creates a reusable transporter using SMTP of gmail

       console.log("filePath",filePath)
            var emailAccountPassword = process.env.TEAM_EMAIL || 'C0ffeeCreamer34';
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                host: 'smtp.gmail.com',
                port: 465,
                secure: true, // use SSL
                auth: {
                    user: 'nerdzquiz@gmail.com',
                    pass:  emailAccountPassword ///to be removed and changed
                }
            });

            transporter.verify(function(error, success) {
                if (error) {
                        console.log(error);
                } else {
                        console.log('Server is ready to take our messages');
                }
            });
            var server = process.env.EMAIL_FROM_SERVER || "http://localhost:8080"
            // var link = server + "/forgot/"; //API TO RESET PASSWORD
            var text = 'You are receiving this email because you are a Sidekick Admin responsible for uploading the attached data into Summit./n The Sidekick Team';
            // var html = '<br><img src="' + server + '"/public/assets/img/sidekick.png" alt="Sidekick" height="42" width="42"/><p>You are receiving this email because you are a Sidekick Admin responsible for uploading the attached data into Summit.</p><br><h4>The Sidekick Team</h4>';
            var html = '<br><br><p>You are receiving this email because you are a Sidekick Admin responsible for uploading the attached data into Summit.</p><br><h4>The Sidekick Team</h4>';
     
            // setup email data
        
            var mailOptions = {
                from: '" Sidekick Education " <nerdzquiz@gmail.com>',
                to: email,
                subject: 'Send to Summit',
                text: text,
                html: html,
                attachments: {
                    path: filePath
                }
            };


            //send the email
            transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                    return console.log(error)
                }
            })

    }
    // thi
    app.post('/summit', function(req,res){
        // sendtosummit is the required permission for this path
        validateUser(req, res, "sendtosummit").then((response) =>{
            // console.log("req.body",req.body[0].fa[0])
            var summitArr = [];
            for (var j = 0; j < req.body.length; j++){
                for (var i = 0; i < req.body[j].fa.length; i++){
                    var instruction = 'Instruction ' + i + ': Course: ' + req.body[j].fa[i].course + ' -->  Project : ' + 'Topic / Dummy For Now' + ' --> INCLUDE --> Focus Area: ' + req.body[j].fa[i].name + ' --> POSITION --> ' + req.body[j].fa[i].Sequence + ' --> UPDATE --> Title: ' + req.body[j].fa[i].name + '(' + req.body[j].fa[i].Sequence +')';
                    summitArr.push(instruction);
                }
            }
      
            // WAiting for updated query srted by query topic === Project
            // waiting for confirmation where to send this data
            // console.log("summitArr", summitArr);
            // create file

            var user =  response.username.split('@');
            fileName = __dirname + '/../public/assets/files/sendToSummit_' + user[0] +'.'+ Date.now() + '.txt';
            var file = fs.createWriteStream(fileName);
            file.on('error', function(err) { 
                console.log(err)
                // return error msg
                // res.json({success: false, error: "Problem creating file"})
            });

            summitArr.forEach(function(v) { file.write(v + '\n'); });
            file.end();
            // send as attachment to email
            var adminEmail = "paths@sidekick.education";
            // var adminEmail = "fiona.hegarty@icloud.com";
            // need to pass file path
            sendToSummitEmail(adminEmail, fileName);
            // return fileName;
        }).then(() =>{
            // delete file - cant do here! gets delte
            // fs.unlinkSync(fileName);
            // send OK msg the browser sending emails....res.sendStatus(200)
            res.json({success: true});
        }).catch((error) => {
            console.log(error);
            console.log(Date.now() + " Authentication Error");
            res.json({success: false, error: "No Permissions to Upload file"})
        })
    })
    app.get('/api/roles/all', function(req, res){
        // get roles from database
        let query = aql`
            for a in auth_roles
            sort a.name asc
            return {name: a.name, _id: a._id, description: a.description}`;

        db.query(query)
        .then(cursor => {  
            res.json(cursor._result);
        }).catch(error => {
            console.log(Date.now() + " Error (Get Roles from Database):", error);
            res.json();
        }) 

     })

    app.get('/api/fa/:faKey', function(req, res){
        let faKey = req.params.faKey;
        // let faKey = parseInt(req.params.faKey);
        console.log(faKey)
        // query database
        let query = aql`
            for f in focusAreas
            filter f._key == ${faKey}
            return f`;
            console.log(query)
        db.query(query)
        .then(cursor => {  
              console.log(cursor._result)
            res.json({success: true, fa: cursor._result});
        }).catch(error => {
            console.log(Date.now() + " Error (Get FA from Database):", error);
            res.json({success: false});
        }) 

    })

    app.get('/api/topics/all', function(req, res){
        let query = aql`
            let topics = UNIQUE(FLATTEN(
                for p in projects
                return p.topics
            ))

           for t in topics
            sort t
            return t
        `;

        db.query(query)
        .then(cursor => {  
            // console.log("type of", cursor._result);
            
            res.json(cursor._result);
        }).catch(error => {
            console.log(Date.now() + " Error (Get Topics from Database):", error);
            res.json();
        })         
        
    }) 
    app.get('/api/standards/:grade?', function(req, res){
        let grades = req.params.grade;
        let queryGrades = [];
        if (grades) queryGrades = grades.split(',');
         
        // console.log("standards grade", queryGrades)
        let query = aql`
            RETURN TO_ARRAY((for s in standards
            filter length(${queryGrades}) > 0 ? TO_ARRAY(s.grade) any in ${queryGrades} : true
            sort s.standard
            return s.standard))
        `;
        db.query(query)
        .then(cursor => {  
            res.json(cursor._result);
        }).catch(error => {
            console.log(Date.now() + " Error (Get Standards from Database):", error);
            res.json();
        })         
        
    })  

       
   // path for roles !== TEACHER or STUDENT - can likely combine but will leave for now
    app.get('/api/courses/:username/', function(req, res){
        let grades = req.params.grade;
        let queryGrades = [];
        if (grades) queryGrades = grades.split(',');
        console.log(req.body)
        // wondering if we should get this from front end  or from db..
        // let role = req.params.role;
        let username = req.params.username;  
        console.log("username", username)
        /// *********now filter based on user role!!
        // dont need role here - should bring back a teacher or students courses - the query will pull these back if queryCourse !== [] elese it will bring all back
        // only teachers or students will have mappings in hasCourses table
        // role will be needed in paths.....role = student should only see their own courses not other students
        let query = aql`
          let userid = (UNIQUE(for u in auth_users filter u.username == ${username} return u._id))
          let queryCourses = (for c in outbound userid[0] hasCourse return c._id)
          for c in courses
            filter length(queryCourses) > 0 ? c._id in queryCourses : true
            filter c.ownerIsBaseCurriculum != true
            SORT c.name asc
            RETURN {_key: c._key, _id: c._id, name: c.name, grade: c.grade}
            `;
        // let query = aql`
        //   let userid = (UNIQUE(for c in outbound userid[0] hasCourse return {_key: c._key, _id: c._id, name: c.name, grade: c.grade}))`
        
     console.log(query)
        db.query(query)
        .then(cursor => { 
            console.log("Course", cursor._result);
            res.json(cursor._result);
        }).catch(error => {
            console.log(Date.now() + " Error (Get Courses from Database):", error);
            res.json();
        })            
    })
   
    // path for roles === TEACHER or STUDENT - can likely combine but will leave for now
    app.get('/api/courses/teacher/student/:username/', function(req, res){
        // let grades = req.params.grade;
        // let queryGrades = [];
        // if (grades) queryGrades = grades.split(',');
        console.log(req.body)
        // wondering if we should get this from front end  or from db..
        // let role = req.params.role;
        let username = req.params.username;  
        console.log("username", username)
        /// *********now filter based on user role!!
        // dont need role here - should bring back a teacher or students courses - the query will pull these back if queryCourse !== [] elese it will bring all back
        // only teachers or students will have mappings in hasCourses table
        // role will be needed in paths.....role = student should only see their own courses not other students
        let query = aql`
          let userid = (UNIQUE(for u in auth_users filter u.username == ${username} return u._id))
          for c in outbound userid[0] hasCourse return {_key: c._key, _id: c._id, name: c.name, grade: c.grade}`
        //   for c in courses
        //     filter c._id in queryCourses 
        //     filter c.ownerIsBaseCurriculum != true
        //     return {_key: c._key_id: c._id, name: c.name, grade: c.grade}
        //     `;
        // // query=aql`for c in outbound ${username} hasCourse
        // //     return {_key: c._key_id: c._id, name: c.name, grade: c.grade}`
     console.log(query)
        db.query(query)
        .then(cursor => { 
            console.log("Course", cursor._result);
            res.json(cursor._result);
        }).catch(error => {
            console.log(Date.now() + " Error (Get Courses from Database):", error);
            res.json();
        })            
    })

    app.get('/fa/:username', function(req, res){
        let username = req.params.username;
        // check this query!!!
        let query = aql`
        let userid = (for u in auth_users filter u.username == ${username} return u._id)
        let queryCourses = (for c in outbound userid[0] hasCourse return c._key)
        let fa_key = (for c in courses
            filter length(queryCourses) > 0 ? c._key in queryCourses : true
                for fa in
                outbound c
                covers
                return fa._key)
        for f in focusAreas 
        filter f._key in fa_key
        return {_key: f._key, name: f.name}`;
     console.log(query)
        db.query(query)
        .then(cursor => { 
            console.log("Course", cursor._result);
            res.json({success: true, fa: cursor._result});
        }).catch(error => {
            console.log(Date.now() + " Error (Get FA from Database):", error);
            res.json({success: false});
        })  

    })
    app.use(function(req, res){
        db.get()
        .then(response => {
            // the database exists
            // main entry point
            res.sendFile(path.join(__dirname, '/../public/index.html'));
            // console.log(Date.now() + " Information: Database is Up");
        }).catch(err => {
            res.sendFile(path.join(__dirname, '/../public/unavailable.html'));
            console.log(Date.now() + " Error: Database is Down.");
        });
       
    })
  
}
