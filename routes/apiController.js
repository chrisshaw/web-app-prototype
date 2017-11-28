var arangojs = require('arangojs');
var Database = arangojs.Database;
const aql = arangojs.aql;
var path = require('path');
var nodemailer = require("nodemailer");
var fs = require('fs');
const config = require('./dbconfig.js')[process.env.DB_MODE];
const normalizr = require('normalizr')
const normalize = normalizr.normalize
const schema = require('../schemas/schemas.js')

module.exports = function(app){
    const db = arangojs(config.dbHostPort);
    db.useDatabase(config.dbName);
    db.useBasicAuth(config.dbUser, config.dbPwd);

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
                    if ((authPerm !== '' ) && (permissions.includes(authPerm) !== -1)) {
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
                    console.log(Date.now() + " Error (Get permissions from Database):");
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
        .then( response => {
            res.setHeader("Set-Cookie",  'x-foxxsessid='+response.headers['x-foxxsessid']);
            return response.body;
        }).then(response => {
            // get user role and permissions
            let userId = response.userid;
            let chgPwd = response.chgPwd;
            let username = response.username;
            // let query = aql`for u in auth_users for ha in auth_hasRole filter ha._from == u._id for ac in auth_hasPermission filter ac._from == ha._to for p in auth_permissions filter p._id == ac._to filter u._id == ${userid} return  p.name`;
            let query = aql`
                for v, e, p
                in 2 outbound ${userId}
                auth_hasRole, auth_hasPermission
                collect role = p.vertices[1]._key into permissions = p.vertices[2]._key
                return { "role": role, "permissions": permissions }
            `;
            db.query(query)
            .then(cursor => {  
                // send permissions list back to requesting client function
                // for updating in redux store
                // admin created users must change password on first login
                const result = cursor._result;
                // console.log(result);
                res.json({success:true, id: userId, username: username, role: result[0].role, permissions: result[0].permissions, chgPwd: chgPwd});
            }).catch(error => {
                console.log(Date.now() + " Error (Get permissions from Database):", error);
                next(error)
            }) 
        }).catch(error => {
            // can send error to logs?
            console.log(Date.now() + " Error (Login):", error.response.body.errorMessage);
            // send basic success: false
            // send error to client for handling
            next(error)
        })
    })
    app.post('/signup' , function(req, res, next){
        console.log('>> Starting signup. What is in the request:')
        Object.entries(req.body).forEach( ([key, value]) => console.log(key, value))
        // verify user is valid and then that they have the right permissions
        validateUser(req, res, "createAccounts")
        .then( response => {
            // double check user permissions on server side
            // if user has the required permission manageusers in their permissions array in
            // req.permissions
            let userObj = req.body;
            // get permissions and username of person doing the signup
            let username = response.username;
            userObj.creator = username;
            // post/save data using foxx service for auth
            const foxxService = db.route('auth');
            foxxService
                .post('/create-account', userObj)
                .then( response => {
                    // create a user to role mapping.....
                    // get userid of person being the signed up
                    console.log('>>>>>> user signed up')
                    Object.entries(response.body).forEach( ([key, value]) => console.log(key, value))
                    res.status(200).json( {success: true, userId: response.userId } )
                })
                .catch(error => {
                    console.log('!>>>>>> error in signing up: ' + error.toString());
                    res.status(500).json( {success: false, msg: error.response.body.errorMessage} )
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

    app.get('/api/path/focus_area_details/:id', function(req, res) {
        const focusAreaId = `focusAreas/${req.params.id}`
        console.log(focusAreaId)
        const query = aql`let parents = FIRST(
                            for c, e, p
                            in 2 inbound ${focusAreaId}
                            focusesOn, hasCourse
                            return distinct {
                                course: KEEP(p.vertices[1], '_id', 'name'),
                                school: p.vertices[2]._id
                            }
                        )
                        
                        let focusAreas = (
                            for f, e, p
                            in 4 inbound ${focusAreaId}
                            any alignsTo, focusesOn, hasCourse
                            filter p.vertices[4] != null
                                and IS_SAME_COLLECTION('courses', p.vertices[3])
                                and IS_SAME_COLLECTION('schools', p.vertices[4])
                                and p.vertices[4]._id == parents.school
                            return distinct {
                                // school: p.vertices[4]._id, // useful for debugging, not required in response
                                course: p.vertices[3].name,
                                _id: p.vertices[2]._id,
                                _key: p.vertices[2]._key,
                                name: p.vertices[2].name
                            }
                        )
                        
                        let standards = (
                            for s
                            in outbound ${focusAreaId}
                            alignsTo
                            filter IS_SAME_COLLECTION('standards', s)
                                and s != null
                            return distinct KEEP(s, '_id', '_key')
                        )
                        
                        let projects = (
                            for p
                            in 2 any ${focusAreaId}
                            alignsTo
                            filter IS_SAME_COLLECTION('projects', p)
                                and p != null
                            return distinct {
                                _id: p._id,
                                _key: p._key,
                                name: p.name,
                                link: p.link,
                                drivingQuestion: p.details.drivingQuestion
                            }
                        )

                        let focusArea = DOCUMENT(${focusAreaId})

                        return {
                            'focusArea': focusArea,
                            'focusAreas': focusAreas,
                            'standards': standards,
                            'projects': projects
                        }`;

      db.query(query)
        .then((cursor) => cursor.all())
        .then((result) => {
          res.send(result);
        })
        .catch((error) => {
          next(error)
        });
    });

  app.get('/api/path/related_projects/:topic', function(req, res) {
    const query = `for p in projects
                    filter LENGTH(p.topics) > 0
                        and '${req.params.topic}' in p.topics
                    sort p.name desc
                    return distinct MERGE(KEEP (p, '_id', '_key', 'name', 'link', 'topics'), { drivingQuestion: p.details.drivingQuestion })`;

    db.query(query)
      .then((cursor) => {
        res.send(cursor._result);
      })
      .catch(() => {
        res.sendStatus(500);
      });
  });
    
     app.post('/api/path/project', (req, res, next) => {
        validateUser(req, res, "buildPath")
        .then( response => {

            const constructQueryParams = queryObject => {
                console.log(queryObject)
                return Object.entries(queryObject).reduce( (queryString, [key, value], i, entries) => {
                    if (i === 0) {
                        queryString = '?'
                    }
                    if ( value instanceof Array ) {
                        queryString += `${key}=${encodeURIComponent(value.join(','))}`
                        if (i !== entries.length - 1) {
                            queryString += '&';
                        }                
                    }
                    return queryString;
                }
                , '');
            }

            console.log(
                "The request body is",
                "\n",
                req.body
            )

            const reqBody = req.body;
            const userKey = response.userkey;
            const queryObject = { userKey }

            if ( reqBody.courses && reqBody.courses.length > 0 ) queryObject.courses = reqBody.courses.map( course => course._key );
            if ( reqBody.grades && reqBody.grades.length > 0 ) queryObject.grades = reqBody.grades.map( grade => grade.toString().toLowerCase() );
            if ( reqBody.subjects && reqBody.subjects.length > 0 ) queryObject.subjects = reqBody.subjects.map( subject => subject.toLowerCase() );
            if ( reqBody.standards && reqBody.standards.length > 0 ) queryObject.standards = reqBody.standards.map( standard => standard.toLowerCase() );
            if ( reqBody.topics && reqBody.topics.length > 0 ) queryObject.topics = reqBody.topics.map( topic => topic.toLowerCase() );
            Object.keys(queryObject).forEach( key => console.log(key, ':', queryObject[key]));

            console.log('Constructing query string');
            const strRequest = constructQueryParams(queryObject);
            const encodedPath = `/${userKey}/build${strRequest}`
            const pathBuilderService = db.route('path');
            console.log('Query string:', encodedPath);

            pathBuilderService
                .get(encodedPath)
                .then( response => {
                    res.status(200).json(normalize(response.body, schema))
                })
                .catch( error => {
                    console.log(Date.now() + " Error (Getting paths from Database):", '\n', error );
                    next(error);
                })


        })
        .catch( error => {
            console.log(Date.now() + " Authentication Error");
            console.log(error);
            next(error)
        });
    });

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

    app.get('/api/pathbuilder/:userKey/options', async (req, res, next) => {
        
        const userKey = req.params.userKey
        console.log(`>>> Options endpoint hit for ${userKey}.`)

        try {
            const query = aql`
            let sources = MERGE(
                for v, e, p
                in 1..3 any ${`auth_users/${userKey}`}
                hasSection, auth_hasRole
                filter IS_SAME_COLLECTION('sections', p.vertices[1])
                    and IS_SAME_COLLECTION('auth_users', p.vertices[2])
                    and IS_SAME_COLLECTION('auth_roles', p.vertices[3])
                    and PARSE_IDENTIFIER(p.vertices[3]._id).key == 'student'
                    for t in [p.vertices[1], p.vertices[2]]
                    collect type = PARSE_IDENTIFIER(t._id).collection into items = t
                    return { [type]: UNIQUE(items) }
            )
            
            for s in sources.auth_users
                for v, e, p
                in 5 outbound s
                hasSection, hasCourse, focusesOn, any alignsTo
                filter IS_SAME_COLLECTION('sections', p.vertices[1])
                    and p.vertices[1] in sources.sections
                    and IS_SAME_COLLECTION('courses', p.vertices[2])
                    and IS_SAME_COLLECTION('focusAreas', p.vertices[3])
                    and IS_SAME_COLLECTION('standards', p.vertices[4])
                    and IS_SAME_COLLECTION('projects', p.vertices[5])
                    and p.vertices[*] none == null
                    and p.vertices[5].topics != null
                    for t in p.vertices[5].topics
                    collect student = KEEP(p.vertices[0], '_key', 'first', 'last', 'grade'),
                        grade = p.vertices[0].grade,
                        course = KEEP(p.vertices[2], '_key', 'name'),
                        subject = p.vertices[3].subject,
                        standard = p.vertices[4]._key,
                        topic = t
                    return {
                        'students': student,
                        'grades': grade,
                        'courses': course,
                        'subjects': subject,
                        'standards': standard,
                        'topics': topic
                    }
            `
            const cursor = await db.query(query)
            const options = await cursor.all()
            res.json( { optionTable: options } )
        } catch (err) {
            next(err)
        }
    })

    app.get(`/api/user/:uid/focusAreas`, async (req, res, next) => {
        const uid = req.params.uid;

        let query = aql`
            for focusArea
            in 2 outbound ${uid}
            hasCourse, focusesOn
            return KEEP(focusArea, '_id', '_key', 'name')
        `;
        try {
            const cursor = await db.query(query)
            const result = await cursor.all
            res.json({ success: true, fa: result })
        } catch (err) {
            next(err)
        }
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
    app.get('/api/topics/', function(req, res){
        let query = aql`
            for p in projects
            filter LENGTH(p.topics) > 0
                for t in p.topics
                collect topic = t
                return topic
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
    app.get('/api/user/:username/courses/', function(req, res){
        let username = req.params.username;  

        let query = aql`
            let userid = FIRST(
                for u in auth_users
                filter u.username == ${username}
                return u._id
            )
            for c
            in 2 outbound userid
            hasSection, hasCourse
            filter IS_SAME_COLLECTION('courses', c)
            sort c.name
            return { _id: c._id, _key: c._key, name: CONCAT(c.name, " (", c.schoolName, ")"), grade: c.grade }
        `;
        
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

    app.get('/api/students', function(req, res) {
        const query = `for vertex, edge, path
                        in 3 any @userId
                        hasSection, outbound auth_hasRole
                        filter IS_SAME_COLLECTION('auth_users', path.vertices[2])
                        and IS_SAME_COLLECTION('auth_hasRole', path.edges[2])
                        and PARSE_IDENTIFIER(path.edges[2]._to).key == 'student'
                        and path.vertices[3] != null
                        return distinct KEEP(path.vertices[2], '_id', '_key', 'username', 'first', 'last', 'grade', 'interests')`;

        db.query(query, {userId: req.query.userId})
          .then((cursor) => {
            res.send(cursor._result);
          })
          .catch(() => {
            res.sendStatus(500);
          });
    });

    app.put('/api/student/interests', function(req, res) {
      const query = `update @student._key with { 
                        interests: @student.interests
                    } in auth_users
                    return NEW`;
      req.body.interests = removeDuplicates(req.body.interests);

      db.query(query, { student: req.body })
        .then((cursor) => {
          res.send(cursor._result[0]);
        })
        .catch(() => {
          res.sendStatus(500);
        });

      function removeDuplicates(interestsObj) {
          let result = {};
          for (interestCategory in interestsObj) {
              result[interestCategory] = interestsObj[interestCategory].filter((interest, index, interests) => interests.indexOf(interest) === index);
          }
          return result;
      }
    });

    app.get('/api/teachers_and_admins', function(req, res) {
        const query = `for v, e, path
                        in 3 any @adminUserId
                        atSchool, auth_hasRole
                        filter IS_SAME_COLLECTION('auth_users', path.vertices[2])
                        filter IS_SAME_COLLECTION('auth_hasRole', path.edges[2])
                        filter PARSE_IDENTIFIER(v._id).key in ['teacher', 'admin']
                        collect user = KEEP(path.vertices[2], 'first', 'last', 'username', '_id', '_key') into role = v._id
                        let firstRole = FIRST(UNIQUE(role))
                        return MERGE(user, { "role": firstRole })`;
        db.query(query, { adminUserId: req.query.adminUserId })
          .then((cursor) => {
            res.send(cursor._result);
          })
          .catch(() => {
            res.sendStatus(500);
          })
    });

    app.put('/api/teachers_and_admins/role', function(req, res) {
        const query = `for vertex, roleEdge
                        in outbound @user
                        auth_hasRole
                        update roleEdge with { 
                            _to: LOWER(@role),
                            lastUpdated: DATE_NOW(),
                            updatedBy: @currentUser
                        } in auth_hasRole
                        return NEW`;
        db.query(query, {
            user: req.body.teacherOrAdminId,
            role: req.body.role,
            currentUser: req.body.currentUserId,
        })
          .then(() => {
            res.sendStatus(204);
          })
          .catch(() => {
            res.sendStatus(500);
          });
    });

    app.get('/api/course', function(req, res) {
        const query = `for course, e, p
                        in 2 outbound @userId
                        hasSection, hasCourse
                        filter p.vertices[2] != null
                        return KEEP(course, "_key", "_id", "grade", "name", "subject", "interests")`;
        db.query(query, { userId: req.query.userId })
          .then((cursor) => {
            res.send(cursor._result);
          })
          .catch(() => {
            res.sendStatus(500);
          });
    });

    app.put('/api/course/interests', function(req, res) {
        const query = `update @course._key with { 
                            interests: @course.interests
                       } in courses
                       return NEW`;
        req.body.interests = removeDuplicates(req.body.interests);

        db.query(query, { course: req.body })
          .then((cursor) => {
            res.send(cursor._result[0]);
          })
          .catch(() => {
            res.sendStatus(500);
          });

        function removeDuplicates(interestsObj) {
          let result = {};
          for (interestCategory in interestsObj) {
            result[interestCategory] = interestsObj[interestCategory].filter((interest, index, interests) => interests.indexOf(interest) === index);
          }
          return result;
        }
    });

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