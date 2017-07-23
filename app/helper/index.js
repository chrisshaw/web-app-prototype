var axios = require("axios");
import actions from '../actions';
// import {connect} from 'react-redux';
// import store from '../store';

// console.log(store)
var helpers = {
    getCookie: function(c_name) {
        if (document.cookie.length > 0) {
            let c_start = document.cookie.indexOf(c_name + "=");
            if (c_start != -1) {
                    c_start = c_start + c_name.length + 1;
                    let c_end = document.cookie.indexOf(";", c_start);
                        if (c_end == -1) {
                        c_end = document.cookie.length;
                    }
                return unescape(document.cookie.substring(c_start, c_end));
            }
        }
        return "";
    },
    submitCSVFile: function(e, dispatch){
        var files = e.target.files || e.dataTransfer.files 
        if (files) {
            //send only the first one
            var file = files[0];
            //read the file content and prepare to send it
            var reader = new FileReader();
            reader.onload = function(e) {
                var buffer = e.target.result;
                var postObj = {
                    name: file.name,
                    buffer: buffer
                };    
                return axios.post('/csv/file', postObj).then(function(response){
                    // console.log("response", response.data);
                    //  added perms check res.json({success: false, auth: false})
                    // handle no perms error auth == false too
                    dispatch(actions.viewUploadedCSVData(response.data.results, response.data.error))          
                })
            }
            // reader.readAsBinaryString(file);
             reader.readAsText(file);
        }
    },
    saveCSVStudentData(data, dispatch){
        let component = this;
        // need to pass the auth header in the cookie to server
        // let USER_TOKEN = helpers.getCookie("x-foxxsessid");

        if (data){
            return axios({
                method: 'post',
                url: '/csv/students/courses/data', 
                data: data,
                // headers: {'x-foxxsessid': USER_TOKEN}
            })
            .then(function(response) {           
                // this will clear the data from the upload Page after saving....
                // by settting csvdata to ""
                dispatch(actions.viewUploadedCSVData(""));
                // ***handle no perms error response.data.auth == false too
                // success or failure - return mesage to client this.props.dataupload = boolean
                component.dataUploadStatus(response.data.success, response.data.error, dispatch);
                return;               
            })
        }
    },
    dataUploadStatus(response, error, dispatch){
        dispatch(actions.returnUploadedStatus(response, error));
    },
    toggleDrawer: function(action, dispatch){
        dispatch(actions.closePathBuilderDrawer(action))
    },
    // getGroups: function(reset, deletedispatch){
    //     return axios.get('/api/teacher/group').then(function(response) {
    //         // send results to redux store for use by Results component
    //         dispatch(actions.updateGroupList(reset, false, 0, response.data));
    //         return response.data;
    //     })
    // },
    getGrades: function(reset, deleteGroup, dispatch){
       var gradeArr = [{_id: 0, name: "6"}, {_id: 1, name: "7"},{_id: 2, name: "8"}, {_id: 3, name: "9"},{_id: 4, name: "10"}, {_id: 5, name: "11"}]
       dispatch(actions.updateList(reset, deleteGroup, 0, 'UPDATE_GRADES', gradeArr));
    },
    getCourses: function(reset, deleteGroup, username, role, dispatch){
        /// parse array to a string for query.
        // console.log("herloer get crs")
        // helper.getCourses(false,false, "", this.props.role, this.props.dispatch); 
        // dont need role here - should bring back a teacher or students courses - the query will pull these back if queryCourse !== [] elese it will bring all back
        // let gradeString = "";
        // if (grade.length !== 0) {
        //     if (grade.length === 1){
        //         gradeString = grade[0].name;
        //     } else {
        //         gradeString = grade[0].name;
        //         for (var i = 1; i < grade.length; i++){
                    
        //             gradeString +=  ',' + grade[i].name;
        //         }
        //     }
        // }
        console.log("role", role);
        // teachers and students must return their own courses -- everyone else can see all
        if ((role) && ((role.toUpperCase() === 'TEACHER') || (role.toUpperCase() === 'STUDENT'))){
            return axios.get('/api/courses/teacher/student/'+username+'/').then(function(response) {
                // send results to redux store for use by Results component
                console.log(response.data)
                dispatch(actions.updateList(reset, deleteGroup, 0, 'UPDATE_COURSES', response.data));
                return;
            })
        } else {
            return axios.get('/api/courses/'+username+'/').then(function(response) {
                // send results to redux store for use by Results component
                console.log(response.data)
                dispatch(actions.updateList(reset, deleteGroup, 0, 'UPDATE_COURSES', response.data));
                return;
            })
        }       
    },
    getStandards: function(reset, deleteGroup, grade, dispatch){
        // console.log("herloer get std")
        /// parse array to a string for query.
        // remove grade!!!!!!
        let gradeString = "";
        if (grade.length > 0) {
            if (grade.length === 1){
                gradeString = grade[0].name;
            } else {
                gradeString = grade[0].name;
                for (var i = 1; i < grade.length; i++){
                    gradeString +=  ',' + grade[i].name;
                }
            }
        }
        return axios.get('/api/standards/'+gradeString).then(function(response) {
                // send results to redux store for use by Results component
                /// need to put in an object with an id
                //  console.log("standards" ,response.data)
                var standardsArr = [];
                for (var i = 0; i < response.data[0].length; i++){
                    standardsArr.push({ _id: i, name: response.data[0][i]})
                }
                // id is not 0 so we can safely use as placeholder
                dispatch(actions.updateList(reset, deleteGroup, 0, 'UPDATE_STANDARDS', standardsArr))
                return;
            }) 
    },
    saveSelectedFA(e, dispatch){
        // need name and id
       dispatch(actions.saveSelectedFA(e));

    },
    getFocusArea: function(dispatch){
        // for now these are hard coded!!!!!
        return axios.get('/api/focusarea').then(function(response) {
            // send results to redux store for use by Results component
            dispatch(actions.getFAList(response.data))
            return;
        })     
    },
    getTopics: function(reset, deleteGroup, dispatch){
        return axios.get('/api/topics/all').then(function(response) {
            // send results to redux store for use by Results component
            /// need to put in an object with an id 
            var topicArr = [];
            for (var i = 0; i < response.data.length; i++){
                // console.log("topics i", response.data[i])
                topicArr.push({ _id: i, name: response.data[i].toLowerCase()})
            }
            dispatch(actions.updateList(reset, deleteGroup, 0, 'UPDATE_TOPICS', topicArr))  
            return;
        }) 
    },

    getSubjectContents: function(reset, deleteGroup, dispatch){
        var subjectArr = [{_id: 0, name: "english"}, {_id: 1, name: "math"}, {_id: 2, name: "science"}, {_id: 3, name: "social studies"}]
        dispatch(actions.updateList(reset, deleteGroup, 0, 'UPDATE_SUBJECTS', subjectArr))
    },
    // newPaths: function(paths, dispatch) {
    //     // clear old path data
    //     dispatch(actions.updatePathList(paths));
    // },
    getPathsAll(courses, grades, standards, topics, subjects, role, dispatch){
         var queryObj = {
            courses: courses,
            grades: grades,
            standards: standards,
            topics: topics,
            subjects: subjects,
            role: role
        }
        // if (role.toUpperCase() === "STUDENT"){
        //     queryObj.userid =
        // }
        console.log("queryObj", queryObj);
        // dispatch(actions.searchPaths(true));
         dispatch(actions.updatePathList("", true, true));
        return axios.post('/api/path/all', queryObj).then(function(response) {
            // console.log("paths returned")
            dispatch(actions.updatePathList(response.data, false, false));
            // hide the searching message
            // dispatch(actions.searchPaths(false));
            return;
        })
    },
    sendToSummit(paths){
        // console.log(props);
       console.log(paths);
        // dispatch(actions.updatePathList("", true, true));
        return axios.post('/summit', paths).then(function(response) {
            console.log("paths returned", response)
            // dispatch(actions.updatePathList(response.data, false, false));
            // hide the searching message
            // dispatch(actions.searchPaths(false));
            return;
        })

    },
    movePath(newPosition, draggedId, currentPath, dispatch) {
        // change to use studentPathPosotin per removeFA
        console.log("ewPosition, draggedId, currentPath, dispatch", newPosition, draggedId, currentPath, dispatch)
        var keyArr =  draggedId.split('/');  // student key [0], fa key [1], faname [2]/[3]
        console.log("currentPath", currentPath); 
        for (var i = 0; i < currentPath.length; i++){
            // find the matching student 
            if (keyArr[0] === currentPath[i].student._key){
                // get the index of the matching student
                // let oldPosition = i;
                // let oldPosition= currentPath[i].fa._key.getIndexOf[keyArr[1]];
                for (var j = 0; j <  currentPath[i].fa.length; j++){
                     if (keyArr[1] === currentPath[i].fa[j]._key){
                            let oldPosition = j;
                            console.log("oldPosition", oldPosition)
                            if (oldPosition > -1) {
                                // swap from old to new position
                                currentPath[i].fa.splice(newPosition, 0,  currentPath[i].fa.splice(oldPosition, 1)[0]);
                                // update path in store
                                dispatch(actions.updatePathList(currentPath, false, false ));         
                                // return;  // exit loop?
                            }
                     }
                    // console.log(i, j)
                }
                // console.log("oldPosition", oldPosition)
                // remove thi
                // console.log(keyArr[0] , currentPath[i].student._key);
                return;
            }
        }

    },
    removeFA(studentPathPosition, idCounter, studentKey, faKey, props){
       // do quick check to make sure the correct fa is being removed
       if ((props.paths[studentPathPosition].student._key === studentKey) && (faKey === props.paths[studentPathPosition].fa[idCounter]._key)){
            // remove 1 FA at array position idCounter
            props.paths[studentPathPosition].fa.splice(idCounter, 1);
             // do some processing to get nextFA and nextStd
            helpers.parseFa(props.paths[studentPathPosition]);
            props.dispatch(actions.updatePathList( props.paths, false, false ));  
       }
   
    },
    addFA(studentPathPosition, idCounter, studentKey, faKey, addFAKey, props){
       // do quick check to make sure the correct fa is being removed
       console.log("addFAKey", addFAKey)
       let addAfterKey =  "";
       if (faKey){
            addAfterKey = props.paths[studentPathPosition].fa[idCounter]._key;
       } 
       if ((props.paths[studentPathPosition].student._key === studentKey) && (faKey === addAfterKey)){
            // remove 1 FA at array position idCounter
            // for now it jst adds a copy
            // get fa details from databsae
        return axios.get('/api/fa/'+addFAKey).then(function(response) {
            console.log(props.paths)
            console.log("response fa", response.data.fa[0])
            if (response.data.success){
                // response.data == fa details
                props.paths[studentPathPosition].fa.splice(idCounter+1, 0, response.data.fa[0]);
                // do some processing to get nextFA and nextStd
                helpers.parseFa(props.paths[studentPathPosition]);
                props.dispatch(actions.updatePathList( props.paths, false, false )); 
            } else {
                // send error message
            }   
            return;
        })
           
       }
   
    },
    parseFa: (result) => {
        // result === cursor._result[p]
        for (var i = 0; i < result.fa.length; i++){
            // console.log(i)
            // console.log(cursor._result[p].fa[i])
            // console.log("fa length", cursor._result[p].fa.length)
            if ( i < result.fa.length-1) result.fa[i].nextFA = result.fa[i+1]['Focus Area'];
            result.fa[i]['currentStd'] = [];
            result.fa[i]['nextStd']= [];
            if (i < result.fa.length-1){  
                for (var j = 0; j <  result.fa[i+1].standardConnections.length; j++){
                    // save the first one
                    if ((j === 0)){
                        result.fa[i].nextStd.push(result.fa[i+1].standardConnections[j]);
                    }
                    // don't save duplicates
                    else if ((j > 0 ) && (result.fa[i+1].standardConnections[j-1] !== result.fa[i+1].standardConnections[j] )){
                        result.fa[i].nextStd.push(result.fa[i+1].standardConnections[j]);
                    }  
                }
            }

            // de-dup current fa std connections
            for (var k = 0; k < result.fa[i].standardConnections.length; k++){
                if ((k === 0)){
                    result.fa[i]['currentStd'].push(result.fa[i].standardConnections[k]);
                }
                else if ((k > 0 ) && (result.fa[i].standardConnections[k-1] !== result.fa[i].standardConnections[k] )){
                result.fa[i]['nextStd'].push(result.fa[i].standardConnections[k]);
                }                 
            }
        }
    },
    removeChip: function(id, queryitem, dispatch){
        if  (queryitem === "Topics") {
            dispatch(actions.updateList(false, true, id, 'UPDATE_TOPICS'));
        }  else if  (queryitem === "Standards") {
            dispatch(actions.updateList(false, true, id, 'UPDATE_STANDARDS'));
        }  else if  (queryitem === "Subjects") {
            dispatch(actions.updateList( false, true, id, 'UPDATE_SUBJECTS'))  
        }  else if  (queryitem === "Grades") {
            dispatch(actions.updateList(false, true, id, 'UPDATE_GRADES'));   // reset, delete,  id
        }   else if  (queryitem === "Courses") {
            dispatch(actions.updateList(false, true, id, 'UPDATE_COURSES')); // reset, delete,  id
        }
    },
    // use to update all query items
    updateSelected: function(e, queryitem, dispatch){
        if (queryitem === "Groups"){
            dispatch(actions.saveSelected(e, 'UPDATE_SELECTED_GROUPS'));
        } else if  (queryitem === "Topics") {
            dispatch(actions.saveSelected(e, 'UPDATE_SELECTED_TOPICS'));
        }  else if  (queryitem === "Standards") {
            dispatch(actions.saveSelected(e, 'UPDATE_SELECTED_STANDARDS'));
        }  else if  (queryitem === "Subjects") {
            dispatch(actions.saveSelected(e, 'UPDATE_SELECTED_SUBJECTS'));
        }   else if  (queryitem === "Grades") {
            dispatch(actions.saveSelected(e, 'UPDATE_SELECTED_GRADES'));
        }   else if  (queryitem === "Courses") {
            dispatch(actions.saveSelected(e, 'UPDATE_SELECTED_COURSES'));
        }
    },
    showView: function(action, dispatch){
        dispatch(actions.setPage(action));
    },
    getRoles: function(dispatch) {
        // return ['admin', 'teacher', 'user', 'internal']
        return axios.get('/api/roles/all').then(function(response) {
            // send results to redux store for use by SignUp component
            dispatch(actions.getRoles(response.data));
            return;
        }) 
    },
    // getUserPerms(dispatch) {
    //     return axios.get('/api/perms/user').then(function(response) {
    //         // send results to redux store for use by SignUp component
    //         dispatch(actions.getPerms(response.data));
    //         return;
    //     }) 

    // },
    loginUser(email, password, dispatch, router){      
        // capture data in object
        let userObj = { 
            "username": email.toLowerCase(),
            "password": password
        }
        // send request to server
        return axios.post('/login', userObj).then(function(response) {
            let msg = "Invalid username or password - please try again";
            // sets login to true or false as appropriate
            // saves the role and permssions and user data
            // dispatch(actions.userPerms(response.data));
            dispatch(actions.userLogin(response.data));
            // captures error and sends any relevant message to UI
            dispatch(actions.userLoginError(!response.data.success, msg));
            // successful login route to default page
            // capture redirect and make change passowrd
            // console.log("chg pwd:", response.data.chgPwd);
            // if a new user force them to create their own secret password 
            // if not new the just log in as normal
            if (response.data.chgPwd) {
                router.push('/password');
                // console.log('router', router);
            } else {
                router.push('/buildpath');
            }
           
            return;
        })
    },

    signUpUsers(email, password, first, last, school, role, dispatch, router){      
        let userObj = { 
            "username": email.toLowerCase(),
            "password": password,
            "first": first,
            "last": last,
            "school": school,
            "role": role,
            "chgPwd": 'true'
        }
        // reset the signup success message
        dispatch(actions.userSignUp(false));
        // let component = this;
        // need to pass the auth header in the cookie to server
        // let USER_TOKEN = helpers.getCookie("x-foxxsessid");
        // send request to server
        return axios({
                method: 'post',
                url: '/signup', 
                data: userObj
        }).then(function(response) {  
            // captures error and sends any relevant message to UI
            // handle no perms error auth == false 
            // console.log("response.data", response.data)
            dispatch(actions.userSignUp(response.data.success));
            dispatch(actions.userLoginError(!response.data.success, response.data.msg));
            return;
        });
    },
    changePwd(pwd, dispatch, route) {
       
        let dataObj = {"password": pwd};
        //  console.log("pwd", dataObj)
        return axios({
                method: 'post',
                url: '/password', 
                data: dataObj
        }).then(function(response) {  
            // handle false later!
            console.log("pwd", response.data);
            if (response.data.success) {
                route.push('/');
            } else {
               dispatch(actions.userLoginError(!response.data.success, response.data.msg));
            }
            return;
        });
        
    },
    loginError(value, msg, dispatch){
         dispatch(actions.userLoginError(value, msg))
    },

    logout(dispatch, router){
        // send to api for auth
        // set logged in to false
        dispatch(actions.userLogin({loggedin: false, username: null, perms: [], role: null}));
        // clear redux store and reset
        dispatch(actions.userLogout());
        router.push('/login');
     }
 };


// We export the helpers function (which contains getGithubInfo)
module.exports = helpers;