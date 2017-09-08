var arangojs = require('arangojs');
var Database = arangojs.Database;
const aql = arangojs.aql;
var path = require('path');
var nodemailer = require("nodemailer");
var fs = require('fs');
const dbSwitch = require('./dbconfig.js');
// var fileName = "";
// console.log(db);
// test connection

module.exports = function(app){
    const dbMode = process.env.DB_MODE;
    const dbHostPort = dbSwitch[dbMode]['dbHostPort'],
        dbUser = dbSwitch[dbMode]['dbUser'],
        dbPwd = dbSwitch[dbMode]['dbPwd'],
        dbName = dbSwitch[dbMode]['dbName'];
    
    const db = arangojs(dbHostPort);
    db.useDatabase(dbName);
    db.useBasicAuth(dbUser, dbPwd);

    function saveStudentGetIds(studentArr, username, i){
        return new Promise((resolve, reject) => {
            // username uniquely identifies user / student in auth_users 
            // table but using studentId for students as this identifies them in the school just to be safe
            // these are dummy users so authData = {} - can be promoted later if required by adding authData
            let query =aql`
                for s in ${studentArr}
                let student_id = (
                    UPSERT { username: s.email}
                    INSERT { studentId: s.studentId, first: s.firstName, last: s.lastName, username: s.email, mentor: s.mentor, school: 'na', role: 'student', chgPwd: true, active: false, dateCreated: DATE_NOW(), dateUpdated: null, createdBy: ${username}, updatedBy: null }
                    UPDATE { studentId: s.studentId, mentor:  s.mentor,  dateUpdated: DATE_NOW(),  updatedBy: ${username} } IN auth_users RETURN NEW._id
                )
                let course_id = (
                    for course in courses
                    filter course.name == s.course
                    return { _id: course._id, section: s.section }
                )
                let role_id = (
                    for r in auth_roles
                    filter UPPER(r.name) == "STUDENT"
                    return r._id
                )
                let fas = (
                    for fa in s.focusAreas
                    let focusArea = (
                        for f in focusAreas
                        filter f.name == fa.faName
                        return f._id
                    )
                    return { fa_id: focusArea[0], focusAreaDetails: fa }
                )
                return { student_id: student_id, role_id: role_id, course_id: course_id, focusArea: fas }
            `;
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
                // console.log("There is a cookie");
                 var cookie = req.cookies['x-foxxsessid'];
            }
            const authService = db.route('auth', {"x-foxxsessid" : cookie});
            authService.get('/user')
            .then(response => {
                // if not null
                // console.log('Received response.');
                // console.log('That resposne is','\n',response);
                if (response.body.username){
                    // console.log('We found the username in response.body.username');
                    // console.log('Now we will send over '+ response.body);
                    return response.body;
                } else {
                    // if username is null reject
                    // console.log('We could not find userame in response.body.username');
                    reject(response.body.username)
                }
            }).then(response => {
                // get the user permissions and validate against current required permission / action 
                // e.g. manageusers
                // console.log("we'll now check permissions.");
                let userId = response.userid;
                let username = response.username;
                let userKey = response.userkey;
                let query = aql`
                    for permission
                    in 2 outbound ${userId}
                    auth_hasRole, auth_hasPermission
                    return permission._key
                `;
                db.query(query)
                .then(cursor => {  
                    // validate whether user has required permssion
                    let permissions = cursor._result;
                    // console.log(authPerm)
                    // console.log(permissions)
                    // console.log("((authPerm !== '' ) && (permissions.indexOf(authPerm) !== -1))", ((authPerm !== '' ) && (permissions.indexOf(authPerm) !== -1)));
                    if ((authPerm !== '' ) && (permissions.indexOf(authPerm) !== -1)) {
                        // console.log('cool, permissions checked out');
                        resolve({success:true, userid: userId, username: username, userkey: userKey });
                    } else if (authPerm === '' ) {
                        // console.log('no permissions ot check so you are good');
                        resolve({ success:true, userid: userId, username: username, userkey: userKey });
                    } else {
                        // console.log('We checked permissions and they did not match')
                        reject();
                    }          
                }).catch(error => {
                    console.log(Date.now() + " Error (Get Perms from Database):");
                    reject();
                }); 
            }).catch(error => {
                if (error) {
                    console.log(Date.now() + " Error (Get Auth User from Database)");
                    console.log(error);
                    reject();
                }
                console.log("User was successfully validated");
            });
        });
    }

   function parseFa(result) { 
        // for each student
        for (var p = 0; p < result.length; p++){
            // for each project
            for (var l = 0; l < result[p].projects.length; l++){
                // for each fa  
                for (var i = 0; i < result[p].projects[l].fa.length; i++){
                    if ( i < result[p].projects[l].fa.length-1) {
                        result[p].projects[l].fa[i].nextFA = result[p].projects[l].fa[i+1].name
                    } else {
                        // if there is another project 
                        if ((result[p].projects.length-1 > l ) && (result[p].projects[l+1].fa.length > 0)){
                            // moves to next project and the first fa in that project if one exists
                            result[p].projects[l].fa[i].nextFA = result[p].projects[l+1].fa[0].name;
                            console.log("result[p].projects[l].fa[i].nextFA", result[p].projects[l].fa[i].nextFA)
                        } else {
                            result[p].projects[l].fa[i].nextFA = [];  
                        }
                    }
                    // console.log(" result[p].projects[l].fa[i].nextFA ",  result[p].projects[l].fa[i].nextFA )
                    result[p].projects[l].fa[i]['currentStd'] = [];
                    result[p].projects[l].fa[i]['nextStd']= [];
                    // next standards
                    if (i < result[p].projects[l].fa.length-1){  
                        console.log("result[p].projects[l].fa[i+1].", result[p].projects[l].fa[i+1]);
                        for (var j = 0; j < result[p].projects[l].fa[i+1].standardConnections.length; j++){
                            // save the first one
                            if ((j === 0)){
                                result[p].projects[l].fa[i].nextStd.push(result[p].projects[l].fa[i+1].standardConnections[j]);
                            }
                            // don't save duplicates
                            else if ((j > 0 ) && (result[p].projects[l].fa[i+1].standardConnections[j-1] !== result[p].projects[l].fa[i+1].standardConnections[j] )){
                                result[p].projects[l].fa[i].nextStd.push(result[p].projects[l].fa[i+1].standardConnections[j]);
                            }  
                        }
                    }  else {
                         // result[p].projects[k].fa[i].nextFA = [];  
                        if ((result[p].projects.length-1 > l ) && (result[p].projects[l+1].fa.length > 0)){
                            // moves to next project and the first fa in that project if one exists
                            for (var j = 0; j < result[p].projects[l+1].fa[0].standardConnections.length; j++){
                                if ((j === 0)){
                                    result[p].projects[l].fa[i].nextStd.push(result[p].projects[l+1].fa[0].standardConnections[j]);
                                }
                                // don't save duplicates
                                else if ((j > 0 ) && (result[p].projects[l+1].fa[0].standardConnections[j-1] !== result[p].projects[l+1].fa[0].standardConnections[j] )){
                                    result[p].projects[l].fa[i].nextStd.push(result[p].projects[l+1].fa[0].standardConnections[j]);
                                }
                            }
                        } else {
                           result[p].projects[l].fa[i].nextStd = [];  // if 
                        }
                    }

                    // de-dup current fa std connections
                    for (var k = 0; k < result[p].projects[l].fa[i].standardConnections.length; k++){
                        if ((k === 0)){
                            result[p].projects[l].fa[i]['currentStd'].push(result[p].projects[l].fa[i].standardConnections[k]);
                        }
                        else if ((k > 0 ) && (result[p].projects[l].fa[i].standardConnections[k-1] !== result[p].projects[l].fa[i].standardConnections[k] )){
                        result[p].projects[l].fa[i]['currentStd'].push(result[p].projects[l].fa[i].standardConnections[k]);
                        }                 
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
            let userId = response.userid;
            let chgPwd = response.chgPwd;
            let username = response.username;
            // let query = aql`for u in auth_users for ha in auth_hasRole filter ha._from == u._id for ac in auth_hasPermission filter ac._from == ha._to for p in auth_permissions filter p._id == ac._to filter u._id == ${userid} return  p.name`;
            let query = aql`
                for v, e, p
                in 2 outbound ${userId}
                auth_hasRole, auth_hasPermission
                collect role = p.vertices[1]._key into perms = p.vertices[2]._key
                return { "role": role, "perms": perms }
            `;
            db.query(query)
            .then(cursor => {  
                // send permissions list back to requesting client function
                // for updating in redux store
                // admin created users must change password on first login
                const result = cursor._result;
                // console.log(result);
                res.json({success:true, id: userId, username: username, role: result[0].role, perms: result[0].perms, chgPwd: chgPwd});
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
        validateUser(req, res, "createAccounts").then((response) =>{
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
                        UPSERT { _from: ${userid} , _to: role[0]._id} INSERT { _from:  ${userid} , _to: role[0]._id, active: ${active}, dateCreated: DATE_NOW(), dateUpdated: null, createdBy:  ${username} , updatedBy: null } UPDATE {  dateUpdated: DATE_NOW(), updatedBy:  ${username} } IN auth_hasRole RETURN { doc: NEW, type: OLD ? 'update' : 'insert' }`     
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
        validateUser(req, res, "manageStudents").then((response) =>{
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
                    // map new student to role STUDENT in the auth_hasRole edge
                    let roleUpsert = aql`for s in ${response[0]}
                        UPSERT { _from: s.student_id[0], _to: s.role_id[0]} INSERT { _from: s.student_id[0], _to: s.role_id[0],  dateCreated: DATE_NOW(), dateUpdated: null, createdBy: ${username} , updatedBy: null } UPDATE {} IN auth_hasRole RETURN { doc: NEW, type: OLD ? 'update' : 'insert' }`;
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
                                let masteredUpsert = aql`for s in ${response[0]}
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

   // for now this just returns a json
    // app.post('/api/path/project', function (req, res){
        
    //     // validateUser(req, res, "buildPath").then((response) =>{
    //         let path = require('../data/faPath.js'); 
    //         console.log("in here.....");
    //         let parsedPath = parseFa(path);
    //         res.json({success: true, paths: parsedPath })
    //     // }).catch((error) => {
    //          console.log(Date.now() + " Authentication Error");
    //          res.json({success: false, error: "No Permissions to View Paths"})
    //     // })
    // })
    
    // comment this bit out for fiona-branch-1 dev and testing
    // app.post('/api/path/project', function (req, res){
    //     validateUser(req, res, "buildPath")
    //     .then( response => {
    //         // intialise
    //         // some pre-processing
    //         console.log(
    //             "The request body is",
    //             "\n",
    //             req.body
    //         );
    //         const reqBody = req.body;
    //         const userKey = response.userkey;
    //         const queryObject = {};
    //         if ( reqBody.courses && reqBody.courses.length > 0 ) queryObject.courses = reqBody.courses.map( course => course._key);
    //         if ( reqBody.grades && reqBody.grades.length > 0 ) queryObject.grades = reqBody.grades.map( grade => grade.name.toString().toLowerCase() );
    //         if ( reqBody.subjects && reqBody.subjects.length > 0 ) queryObject.subjects = reqBody.subjects.map( subject => subject.name.toLowerCase() );
    //         if ( reqBody.standards && reqBody.standards.length > 0 ) queryObject.standards = reqBody.standards.map( standard => standard.name.toLowerCase() );
    //         if ( reqBody.topics && reqBody.topics.length > 0 ) queryObject.topics = reqBody.topics.map( topic => topic.name.toLowerCase() );
    //         Object.keys(queryObject).forEach( key => console.log(key, ':', queryObject[key]));

    //         console.log('Constructing query string');
    //         const strRequest = constructQueryParams(queryObject);
    //         const pathBuilderService = db.route('path');
    //         console.log('Query string:', `/${userKey}/build${strRequest}`);
    //         pathBuilderService.get(`/${userKey}/build${strRequest}`)
    //         .then( response => {
    //             console.log("Response??",'\n',response.body._documents);
    //             res
    //                 .status(200)
    //                 .json(response.body._documents)
    //         })
    //         .catch( error => {
    //             console.log(Date.now() + " Error (Getting paths from Database):", '\n', error );
    //             res.json();
    //         })
    //     })
    //     .catch((error) => {
    //         console.log(Date.now() + " Authentication Error");
    //         console.log(error);
    //         res.json({success: false, error: "No Permissions to View Paths"})
    //     });
    // });

// this is just for my testing
     app.post('/api/path/project', function (req, res){
        validateUser(req, res, "buildPath")
        .then( response => {
            // intialise
            // some pre-processing
            console.log(
                "The request body is",
                "\n",
                req.body
            );
            const reqBody = req.body;
            const userKey = response.userkey;
            const queryObject = {};
            if ( reqBody.courses && reqBody.courses.length > 0 ) queryObject.courses = reqBody.courses.map( course => course._key );
            if ( reqBody.grades && reqBody.grades.length > 0 ) queryObject.grades = reqBody.grades.map( grade => grade.name.toString().toLowerCase() );
            if ( reqBody.subjects && reqBody.subjects.length > 0 ) queryObject.subjects = reqBody.subjects.map( subject => subject.name.toLowerCase() );
            if ( reqBody.standards && reqBody.standards.length > 0 ) queryObject.standards = reqBody.standards.map( standard => standard.name.toLowerCase() );
            if ( reqBody.topics && reqBody.topics.length > 0 ) queryObject.topics = reqBody.topics.map( topic => topic.name.toLowerCase() );
            Object.keys(queryObject).forEach( key => console.log(key, ':', queryObject[key]));

            console.log('Constructing query string');
            const strRequest = constructQueryParams(queryObject);
            const pathBuilderService = db.route('path');
            console.log('Query string:', `/${userKey}/build${strRequest}`);
            pathBuilderService.get(`/${userKey}/build${strRequest}`)
            .then( response => {
                console.log("Response",'\n',response.body);
                res
                    .status(200)
                    .json(response.body)
            })
            .catch( error => {
                console.log(Date.now() + " Error (Getting paths from Database):", '\n', error );
                res.json();
            })
            // TEST DEVELOPMENT
            // Just send a file back
            // let results = require('./results.js');
            // res
            //     .status(200)
            //     .json(results)
            // this file simulates actual data
            // the results are sent back an an array of the format:
            // [ { projectPath: [], studentsOnPath: [ 'auth_users/6796387' ] },
            // { projectPath: [ [Object], [Object] ],
            //      studentsOnPath: [ 'auth_users/6796383' ] },
            //  { projectPath: [ [Object] ],
            //      studentsOnPath: [ 'auth_users/6796385' ] } ]
            //  the client expects an array of objects and this may need to be adjusted depending on what is actually sent from the database
            // console.log(results)
        })
        .catch((error) => {
            console.log(Date.now() + " Authentication Error");
            console.log(error);
            res.json({success: false, error: "No Permissions to View Paths"})
        });
    });



    const constructQueryParams = queryObject => {
        return Object.keys(queryObject).reduce( (queryString, key, i, keys) => {
            if (i === 0) {
                queryString = '?'
            }
            if ( queryObject[key].length > 0 ) {
                queryString += key + '=' + queryObject[key].join(',');
                if (i !== keys.length - 1) {
                    queryString += '&';
                }                
            }
            return queryString;
        }
        , '');
    };

    app.post("/csv/file", function(req, res, next){
        validateUser(req, res, "manageStudents").then((response) =>{
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
        return new Promise((resolve, reject) => {
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
                    reject(error);
                } else {
                    console.log('Server is ready to take our messages');
                }
            });
            // var server = process.env.EMAIL_FROM_SERVER || "http://localhost:8080"
            // var link = server + "/forgot/"; //API TO RESET PASSWORD
            var text = 'You are receiving this email because you are a Sidekick Admin responsible for uploading the attached data into Summit./n The Sidekick Team';
            var html = '<br><div style="text-align: right; height:30; width:100"><img src="cid:unique@sidekick" height="42" width="42" alt="Sidekick"/></div><p>You are receiving this email because you are a Sidekick Admin responsible for uploading the attached data into Summit.</p><br><h4>The Sidekick Team</h4>';
            // var html = '<br><br><p>You are receiving this email because you are a Sidekick Admin responsible for uploading the attached data into Summit.</p><br><h4>The Sidekick Team</h4>';
    //         html: 'Embedded image: <img src="cid:unique@kreata.ee"/>',
        // attachments: [
            var imgPath = __dirname + '/../public/assets/img/sidekick.png';
            var mailOptions = {
                from: '" Sidekick Education " <nerdzquiz@gmail.com>',
                to: email,
                subject: 'Send to Summit',
                text: text,
                html: html,
                attachments: [{
                    path: filePath
                },
                {
                    filename: 'sidekick.png',
                    path:  imgPath,
                    cid: 'unique@sidekick' //same cid value as in the html img src
                }]
            };
            //send the email
            transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                    console.log(error)
                    reject(error)
                }
                resolve(filePath)
            })
        })
    }

    function createInstructions(data){
        console.log("data", data)
        let studentArr = [];
        for (var s = 0; s < data.length; s++ ){
            let studentObj = {};   
            let grade = 'dummygrade';
            // console.log("grade"grade)
            studentObj.name =  data[s].student.first + ' ' + data[s].student.last ;
            studentObj.grade =  "dummy data" + s;  // this is dummy data
            // for each project
            let projArr = [];
            console.log("s", s)
            for (var j = 0; j < data[s].projects.length; j++){
                let projObj = {};
                projObj.name =  data[s].projects[j].name;   
                // for each fa
                let faArr = [];
                 for (var i = 0; i <  data[s].projects[j].fa.length; i++){
                    let faObj = {}
                    faObj.course =  data[s].projects[j].fa[i].course;
                    faObj.position = data[s].projects[j].fa[i].courseSequence;
                    faObj.faProjSeq = data[s].projects[j].fa[i].name + '(' + data[s].projects[j].fa[i].projectSequence +')';
                    faArr.push(faObj);          
                }
                projObj.fa = faArr; 
                projArr.push(projObj);             
             }
             studentObj.project = projArr;
             studentArr.push(studentObj)
         } 
        return studentArr; 
    }
    function saveNewPath(data, username) {
        // save path to data base then after this send mail to sidekick for upload
        return new Promise((resolve, reject) => {
            var studentArr = [];
            var newPathArr = [];
            // var summitArr = []
            // get latest ids
            // for each student
            // var instructionCounter = 0;
            for (var s = 0; s < data.length; s++ ){
                // for each project
                let studentObj = {_id: data[s].student._id}
                let projectsArr=[];
                for (var j = 0; j < data[s].projects.length; j++){
                    // prepare data for saving to db
                    let faArr=[];
                    // for each focus area
                    for (var i = 0; i <  data[s].projects[j].fa.length; i++){
                        // instructionCounter++;
                        let faObj = {
                            _id:   data[s].projects[j].fa[i]._id,
                            _key:  data[s].projects[j].fa[i]._key,
                            sequence: i+1
                        }
                        faArr.push(faObj);
                        // for send to summit email
                        // var instruction = 'Instruction ' + instructionCounter + ': Course: ' + data[s].projects[j].fa[i].course + ' -->  Project : ' + data[s].projects[j].name + ' --> INCLUDE --> Focus Area: ' + data[s].projects[j].fa[i].name + ' --> POSITION --> ' + data[s].projects[j].fa[i].courseSequence + ' --> UPDATE --> Title: ' + data[s].projects[j].fa[i].name + '(' + data[s].projects[j].fa[i].projectSequence +')';   
                    } 

                    if (faArr.length > 0 ){
                        let projectsObj={ name: data[s].projects[j].name, fa: faArr, sequence: j+1}
                        projectsArr.push(projectsObj);
                    }      
                }
                // don't save empty paths
                if (projectsArr.length !== 0){     
                    studentObj.path = projectsArr;
                    studentObj.active = true;
                    studentObj.createdDate = Date.now();
                    studentObj.createdBy = username;
                    studentObj.updatedDate = null;
                    studentObj.updatedBy = null;
                    studentArr.push(studentObj)
                }

            }
            
            // rewrote update logic for  tran 
            if ( studentArr.length > 0 ){       
                const action = String(function (studentArr, username) {
                    // This code will be executed inside ArangoDB!
                    const db = require('@arangodb').db;
                    const aql = require('@arangodb').aql;
                    // get oldpath ids and store for use below
                    let getOldPath = aql`for s in ${params.studentArr}
                        let cpArr = (for c in outbound s onPath return c._id)
                        for cp in currentPath
                            filter cp._id in cpArr
                            filter cp.active == true
                        return { sid: s._id, previd: cp._id}`;
                    params.prevPathIdArr = db._query(getOldPath).toArray();
                    // insert the new path and store the new ids
                    let insertNewPath = aql`for s in ${params.studentArr}
                        INSERT s IN currentPath return {_from: s._id, _to: NEW._id}`;
                    params.newPathIdArr = db._query(insertNewPath).toArray();  
                    // insert newPathIdArr into onPath edge
                    let insertonPathEdgeQuery = aql`for e in ${params.newPathIdArr} INSERT {_from: e._from, _to: e._to} IN onPath return NEW`;
                    db._query(insertonPathEdgeQuery);
                    // insert from: oldpathid to: newpathid into UpdateTo
                    let insertUpdatedToEdgeQuery = aql`for old in ${params.prevPathIdArr}
                        for new in ${params.newPathIdArr} 
                        filter old.sid == new._from
                        INSERT {_from: old.previd, _to: new._to} IN updatedTo return NEW`;           
                    let insertUpdatedToEdgeResult = db._query(insertUpdatedToEdgeQuery);
                    // set to old path to inactive 
                    let updateToInactiveQuery = aql`for e in ${params.prevPathIdArr}
                        for c in currentPath
                            filter c._id == e.previd
                            UPDATE c with {active: false, updatedDate:  DATE_NOW(), updatedBy:"TEST" }
                        IN currentPath return NEW`;
                    let updateToInactiveResult = db._query(updateToInactiveQuery);    
                    return;
                })


                db.transaction({read: ['currentPath', 'onPath'], write: ['currentPath', 'onPath', 'updatedTo']},
                action,
                {studentArr: studentArr, user: username, prevPathIdArr:[], newPathIdArr: [] })
                .then(() => {
                    // all goodnow send to summit
                    // let summitArr = createInstructions(data);   
                    resolve(createInstructions(data));
                }).catch((error)=>{
                    console.log(error);
                    reject(error);
                })
            } else {
                // let summitArr = ;   
                resolve(createInstructions(data)); // what to resolve?
            }
        })
    }

    app.post('/summit', function(req,res){
        // sendtosummit is the required permission for this path
        validateUser(req, res, "publish").then((response) =>{
            // first save the data then send to summit
            saveNewPath(req.body, response.username).then((summitArr) => {
                // Waiting for updated query srted by query topic === Project
                // waiting for confirmation where to send this data
                // create file
                console.log("summitArr", summitArr)
                if (summitArr.length !== 0 ){
                    // don't send to Summit Email if no data
                    var user =  response.username.split('@');
                    var fileName = __dirname + '/../public/assets/files/sendToSidekick_' + user[0] +'.'+ Date.now() + '.txt';
                    var file = fs.createWriteStream(fileName);
                    file.on('error', function(err) { 
                        console.log(err)
                        // return error msg
                        res.json({success: false, error: "Problem creating file"})
                    });

                    // // loop through summit array and write it out
                    // for (var u = 0 ; u < summitArr.length; u++){
                    //     summitArr
                    // }


                    summitArr.forEach(function(v) { 
                        // loop through summit array and write it out
                        // for (var u = 0 ; u < v.length; u++){
                            file.write("GRADE: " +v.grade + '\n');
                            file.write("STUDENT:"  + v.name + '\n');
                            for (var u = 0; u < v.project.length; u++){
                                file.write('PROJECT: ' + v.project[u].name + '\n');
                                // console.log(v.project[u].fa)
                                for (var w = 0; w < v.project[u].fa.length; w++){
                                   file.write('COURSE: ' + v.project[u].fa[w].course + '\n');
                                //    file.write('POSITION: ' + v.project[u].fa[w].position + '\n');
                                   file.write("TITLE: " + v.project[u].fa[w].faProjSeq + '\n');
                                }
                                
                            }
                            file.write("***************"  + '\n');
                        // }
                        // file.write(v + '\n');
                    });
                    file.end();
                    // send as attachment to email
                    // var adminEmail = "paths@sidekick.education, fiona.hegarty@icloud.com";
                    var adminEmail = "fiona.hegarty@icloud.com";
                    // need to pass file path
                    sendToSummitEmail(adminEmail, fileName).then((fileName) => {
                        // delete file - cant do here! gets delte
                        fs.unlinkSync(fileName);
                        // send OK msg the browser sending emails....res.sendStatus(200)
                        res.json({success: true, successMsg: "Data successfully sent to Summit."});
                    }).catch((error) => {
                        console.log(error);
                        //send error status code?
                        res.json({success: false,  errorMsg:  "There was a problem sending data, please contact support."});
                    })
                } else {
                     res.json({success: false,   errorMsg: "There was a problem sending data, please contact support."}); // catch error to say no data!!
                }
            }).catch((error) => {
                console.log(error);
                res.json({success: false, errorMsg:  "There was a problem sending data, please contact support."})
            })

        }).catch((error) => {
            // User validation error
            console.log(error);
            //send error status code?
            res.json({success: false, successMsg: error})
        })
    })
    app.get('/api/roles/all', function(req, res){
        // get roles from database
        let query = aql`
            for a in auth_roles
            sort a._key asc
            return {name: a._key, _id: a._id, description: a.description}`;

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
            return s._key))
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
        // console.log(req.body)
        // wondering if we should get this from front end  or from db..
        // let role = req.params.role;
        let username = req.params.username;  
        // console.log("username", username)
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
        
        // console.log(query)
        db.query(query)
        .then(cursor => { 
            // console.log("Course", cursor._result);
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
        // console.log("username", username)
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
    //  console.log(query)
        db.query(query)
        .then(cursor => { 
            // console.log("Course", cursor._result);
            res.json(cursor._result);
        }).catch(error => {
            console.log(Date.now() + " Error (Get Courses from Database):", error);
            res.json();
        })            
    })
    
    app.get('/fa/:username', function(req, res){
        let username = req.params.username;
        // covers replaced with focusesOn
        // check this query!!!
        let query = aql`
        let userid = (for u in auth_users filter u.username == ${username} return u._id)
        let queryCourses = (for c in outbound userid[0] hasCourse return c._key)
        let fa_key = (for c in courses
            filter length(queryCourses) > 0 ? c._key in queryCourses : true
                for fa in
                outbound c
                focusesOn
                return fa._key)
        for f in focusAreas 
        filter f._key in fa_key
        return {_key: f._key, name: f.name}`;
    //  console.log(query)
        db.query(query)
        .then(cursor => { 
            // console.log("FA", cursor._result);
            res.json({success: true, fa: cursor._result});
        }).catch(error => {
            console.log(Date.now() + " Error (Get FA from Database):", error);
            res.json({success: false});
        })  

    })

    app.post('/api/fa/names', function(req, res){
        let fa = req.body;
        // covers replaced with focusesOn
        // check this query!!!
        let query = aql`for item in ${fa}
        for f in focusAreas
        filter f._id == item._id
        return {name: f.name, _id: f._id, _key: f._key}`;
    //  console.log(query)
        db.query(query)
        .then(cursor => { 
            console.log("FA", cursor._result);
            res.json({success: true, focusAreas: cursor._result});
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
       
    });
  
}