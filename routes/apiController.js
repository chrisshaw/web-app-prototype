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

    function saveStudentGetIds(studentArr, username, i){
        return new Promise((resolve, reject) => {
            let query =aql`for s in ${studentArr}
            let student_id = (UPSERT{ studentId: s.studentId } INSERT { studentId: s.studentId,firstName: s.firstName,  lastName: s.lastName, email: s.email, mentor:  s.mentor, dateCreated: DATE_NOW(),  dateUpdated: null, createdBy: ${username}, updatedBy: null} UPDATE {email: s.email, mentor:  s.mentor,  dateUpdated: DATE_NOW(),  updatedBy: ${username} } IN students RETURN NEW._id )
            let course_id = (for v in courses Filter v.name == s.course return {_id:v._id, section: s.section})
            let fas = (for fa in s.focusAreas
                let focusArea = (for f in focusAreas filter f["Focus Area"] == fa.faName return f._id)
                return {fa_id: focusArea[0], focusAreaDetails: fa})
            return {student_id: student_id, course_id: course_id,focusArea: fas }`
            // GET DATA --> UPDATE DATA
            db.query(query)
            .then(cursor => {  
                // return the data that contains ids for the next steps
                resolve(cursor._result);
            }).catch(error => {
                reject(error)
            })
        }); 
    }

    app.get('/whoami',function(req, res, next){
       
    })

    app.post('/login' , function(req, res, next){
        const foxxService = db.route('auth');
        // console.log(req.body)
        foxxService.post('/login', req.body)
        .then(response => {
            console.log("login response:", response.headers);
            res.setHeader("Set-Cookie",  'x-foxxsessid='+response.headers['x-foxxsessid']);
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
        // verify user can sign up other users...... 
        getUser(req, res).then((response) =>{
            // get perms and username of person doing the signup
            let username = response.username;
            // post/save data using foxx service for auth
            const foxxService = db.route('auth');
            foxxService.post('/signup', req.body)
            .then(function(response){
                // create a user to role mapping.....
                // get userid of person being the signed up
                let userid = response.body.userid;
                let role = req.body.role;
                let query=aql`let userid = ${userid} 
                                let role = (for a in auth_roles 
                                    filter UPPER(a.name) == UPPER(${role})
                                    return {_id: a._id})
                        UPSERT { _from: ${userid} , _to: role[0]._id} INSERT { _from:  ${userid} , _to: role[0]._id, dateCreated: DATE_NOW(), dateUpdated: null, createdBy:  ${username} , updatedBy: null } UPDATE {  dateUpdated: DATE_NOW(), updatedBy:  ${username} } IN auth_user_hasRole RETURN { doc: NEW, type: OLD ? 'update' : 'insert' }`     
                db.query(query)
                .then(cursor => {  
                    res.json({success: true})
                }).catch(error => {
                     console.log(error)
                    res.json({success: false, msg: error.response.body.errorMessage})
                })
            })
            .catch(error => { 
                // can send error to logs?
                console.log(Date.now() + " Error (SignUp):", error.response.body.errorMessage);
                // send basic success: false
                // send error to client for handling
                res.json({success:false, msg: error.response.body.errorMessage});
            })
        })
    })

     function getUser(req, res) {
        return new Promise( (resolve, reject) => { 
            let cookies = "";
            if (req.cookies) {
                 var cookie = req.cookies['x-foxxsessid'];;
            }
            const foxxService = db.route('auth', {"x-foxxsessid" : cookie});
            foxxService.get('/user')
            .then(response => {
                resolve(response.body);
            }).catch(error => {
                reject(error)
                console.log("??error", error);
            })
        });      
    }

    app.post("/csv/students/courses/data", function(req, res, next){
        // validate user before save and use name in save
        getUser(req, res).then((response) =>{
            let username = response.username;
            console.log(" in get user response ")
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
                    // console.log(studentArr);
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
                        // console.log(response[i].focusArea);
                        if (nullFAs.length > 0) errorArr.push(nullFAs);
                        // get distinct
                    }

                    return [response, errorArr]
                }).then((response) => { 

                    // update later to:
                    // studentToFA == hasMastered
                    // studentToCourse == taking
                    // courseToFA == covers
                    let firstUpsert = aql`for s in ${response[0]}
                    UPSERT { _from: s.student_id[0] , _to: s.course_id[0]._id} INSERT  { _from: s.student_id[0] , _to: s.course_id[0]._id, section: s.course_id[0].section, dateCreated: DATE_NOW(), dateUpdated:  null, createdBy: ${username}, updatedBy: null} UPDATE { section: s.course_id[0].section,  dateUpdated: DATE_NOW(), updatedBy: ${username}} IN taking RETURN { doc: NEW, type: OLD ? 'update' : 'insert' } `
                    db.query(firstUpsert)
                    .then(cursor => {  
                         console.log("inserted 1:", cursor._result);
                        // INSERT 
                        // remove any fa where hasMastered != "FALEs"
                        let secondUpsert = aql`for s in  ${response[0]}
                        for fa in s.focusArea 
                        FILTER UPPER(fa.focusAreaDetails.mastered) == 'TRUE'
                        UPSERT { _from: s.student_id[0], _to: fa.fa_id} INSERT { _from: s.student_id[0], _to: fa.fa_id, type: fa.focusAreaDetails.faType, mastered: UPPER(fa.focusAreaDetails.mastered),  dateCreated: DATE_NOW(), dateUpdated: null, createdBy: ${username} , updatedBy: null } UPDATE { type: fa.focusAreaDetails.faType, mastered: UPPER(fa.focusAreaDetails.mastered),  dateUpdated: DATE_NOW(), updatedBy: ${username}  } IN hasMastered RETURN { doc: NEW, type: OLD ? 'update' : 'insert' }`;
                        // console.log(secondUpsert)
                        db.query(secondUpsert)
                        .then(cursor => {  
                            console.log("inserted 2:", cursor._result);
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
                }).catch((error) => {
                    console.log(Date.now() + " Error (Getting IDs from Database):", error);
                    res.json({success: false})
                }) 
            } else {
                res.json({success: false, loggedin: false})
            }
        }).catch((error) => {
             console.log(Date.now() + " Authentication Error", error);
             res.json({success: false, loggedin: false})
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
            // console.log("type of", cursor._result);
            res.json(cursor._result);
        }).catch(error => {
            console.log(Date.now() + " Error (Get Roles from Database):", error);
            res.json();
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
            // console.log("standards", cursor._result);
            res.json(cursor._result);
        }).catch(error => {
            console.log(Date.now() + " Error (Get Standards from Database):", error);
            res.json();
        })         
        
    })

    
    app.get('/api/courses/:grade?', function(req, res){
        let grades = req.params.grade;
        let queryGrades = [];
        // console.log(grades)
        if (grades) queryGrades = grades.split(',');
        let query = aql`
            for c in courses
            filter length(${queryGrades}) > 0 ? TO_ARRAY(TO_STRING(c.grade)) any in ${queryGrades} : true
            SORT c.name asc
            return {_id: c._id, name: c.name}
        `;

        db.query(query)
        .then(cursor => { 
            res.json(cursor._result);
        }).catch(error => {
            console.log(Date.now() + " Error (Get Courses from Database):", error);
            res.json();
        })            
    })


    // using post as passing object - probably not ideal
    app.post('/api/path/all', function (req, res){
        // intialise
        let queryCourses = [];
        let queryGrades = [];
        let queryStandards = []; 
        let querySubjects = [];
        let queryTopics = []; 
        // some pre-processing
        if (req.body.courses){
            if (req.body.courses.length > 0){
                for (var i = 0; i < req.body.courses.length; i++){
                    queryCourses.push(req.body.courses[i].name.toUpperCase());
                }
            }
        }
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

        // grab topics from projects, find connected fas
        var query = aql`let topicalFas = LENGTH(${queryTopics}) == 0 ? [] : (
            return UNIQUE(FLATTEN(
                for p in projects
                filter p.topics[* return UPPER(CURRENT)] any in ${queryTopics}[* return UPPER(CURRENT)]                
                    for fa in
                    2 outbound p
                    alignsTo, addressedBy
                    return fa._key
                ))
        )
        let courseFas = LENGTH(${queryCourses}) == 0 ? [] : (
            return UNIQUE(FLATTEN(
                for c in courses
                filter UPPER(c.name) in ${queryCourses}
                    for fa in
                    outbound c
                    covers
                    return fa._key
                ))
        )
        let starters = (
            for fa in focusAreas
            let priors = (
                for v
                in inbound fa
                thenFocusOn
                return v
            )
            filter LENGTH(priors) == 0
            return fa._id
        )
        // the path we want to send to the front
        for start in starters
            for fa in
            0..999 outbound start
            thenFocusOn
            filter length(${querySubjects}) > 0 ? UPPER(fa.subject) in ${querySubjects} : true
            filter length(${queryGrades}) > 0 ? TO_ARRAY(fa.grade) any in ${queryGrades} : true
            filter length(courseFas) > 0 ? fa._key in courseFas[0] : true
            filter length(topicalFas) > 0 ? fa._key in topicalFas[0]: true
            filter length(${queryStandards}) > 0 ? fa.standardConnections[* return UPPER(CURRENT)] any in ${queryStandards}[* return UPPER(CURRENT)] : true
            return fa`; // return grade and groupname too`
        
        db.query(query).then(cursor => {
            // cursor is a cursor for the query result
            // reformat results for  easy client display
            var pathArr = cursor._result;
            for (var i = 0; i < pathArr.length; i++){
                if ( i < pathArr.length-1) pathArr[i].nextFA = pathArr[i+1]['Focus Area'];
                pathArr[i].currentStd = [];
                pathArr[i].nextStd = [];
                if (i < pathArr.length-1){  
                    for (var j = 0; j < pathArr[i+1].standardConnections.length; j++){
                        // save the first one
                        if ((j === 0)){
                            pathArr[i].nextStd.push(pathArr[i+1].standardConnections[j]);
                        }
                        // don't save duplicates
                        else if ((j > 0 ) && (pathArr[i+1].standardConnections[j-1] !== pathArr[i+1].standardConnections[j] )){
                            pathArr[i].nextStd.push(pathArr[i+1].standardConnections[j]);
                        }  
                    }
                }
                // de-dup current fa std connections
                for (var k = 0; k < pathArr[i].standardConnections.length; k++){
                    if ((k === 0)){
                        pathArr[i].currentStd.push(pathArr[i].standardConnections[k]);
                    }
                    else if ((k > 0 ) && (pathArr[i].standardConnections[k-1] !== pathArr[i].standardConnections[k] )){
                        pathArr[i].nextStd.push(pathArr[i].standardConnections[k]);
                    }                 
                }
            }
            
            res.json(pathArr);          
        }).catch((error => {
             console.log(Date.now() + " Error (Getting paths from Database):", error);
             res.json();
        }))
    })

    app.post("/csv/file", function(req, res, next){
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
    })

    app.use(function(req, res){
        // main entry point
        res.sendFile(path.join(__dirname, '/../public/index.html'));
    })
  
}
