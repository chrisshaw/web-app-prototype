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
                }).catch((error) => {
                // send message to client...needs work
                console.log(error)
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
                // success or catchure - return mesage to client this.props.dataupload = boolean
                component.dataUploadStatus(response.data.success, response.data.error, dispatch);
                return;               
            }).catch((error) => {
                // send message to client...needs work
                console.log(error)
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
        // teachers and students must return their own courses -- everyone else can see all
        if ((role) && ((role.toUpperCase() === 'TEACHER') || (role.toUpperCase() === 'STUDENT'))){
            return axios.get('/api/courses/teacher/student/'+username+'/').then(function(response) {
                // send results to redux store for use by Results component
                dispatch(actions.updateList(reset, deleteGroup, 0, 'UPDATE_COURSES', response.data));
                return;
            })
        } else {
            return axios.get('/api/courses/'+username+'/').then(function(response) {
                // send results to redux store for use by Results component
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
            }).catch((error) => {
                // send message to client...needs work
                console.log(error)
            })
    },
    saveSelectedFA(e, dispatch){
        // need name and id
       dispatch(actions.selectedFA(e));

    },
    getFocusArea: function(dispatch){
        // for now these are hard coded!!!!!
        return axios.get('/api/focusarea').then(function(response) {
            // send results to redux store for use by Results component
            dispatch(actions.getFAList(response.data))
            return;
        }).catch((error) => {
            // send message to client...needs work
            console.log(error)
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
        }).catch((error) => {
            // send message to client...needs work
            console.log(error)
        })   
    },

    getSubjectContents: function(reset, deleteGroup, dispatch){
        var subjectArr = [{_id: 0, name: "english"}, {_id: 1, name: "math"}, {_id: 2, name: "science"}, {_id: 3, name: "social studies"}]
        dispatch(actions.updateList(reset, deleteGroup, 0, 'UPDATE_SUBJECTS', subjectArr))
    },
    // this path is for new query based on project
    getPathProjectAll(courses, grades, standards, topics, subjects, role, dispatch){
         var queryObj = {
            courses: courses,
            grades: grades,
            standards: standards,
            topics: topics,
            subjects: subjects,
            role: role
        }
        dispatch(actions.updatePathList("", true, true));
        return axios.post('/api/path/project', queryObj).then(function(response) {
            console.log("output from file", response.data.paths)
            dispatch(actions.updatePathList(response.data.paths, false, false));
            return;
         }).catch((error) => {
            // send message to client...needs work
            console.log(error)
        })  
    },
    // original query based on student and not group into projects
    getPathsAll(courses, grades, standards, topics, subjects, role, dispatch){
         var queryObj = {
            courses: courses,
            grades: grades,
            standards: standards,
            topics: topics,
            subjects: subjects,
            role: role
        }
        dispatch(actions.updatePathList("", true, true));
        return axios.post('/api/path/all', queryObj).then(function(response) {
            console.log(response.data)
            dispatch(actions.updatePathList(response.data, false, false));
            return;
         }).catch((error) => {
            // send message to client...needs work
            console.log(error)
        })  
    },
    sendToSidekick(paths){
        return axios.post('/summit', paths).then(function(response) {
            return;
         }).catch((error) => {
            // send message to client...needs work
            console.log(error)
        })  

    },
    movePath(newPosition, draggedId, props) {
        // change to use studentPathPosotin per removeFA
        var oldArr =  draggedId.split('/');  // student key [0], fa key [1], faname [2] ,  student position [3], proj position [4], fa position[5],
        var newArr = newPosition.split('/');  // student position [0], proj position [1], fa position[2],
        let studentPathPosition = oldArr[3];  // should be same as for newArr
        let oldProject = oldArr[4];
        let oldFa = oldArr[5];
        let newProject = newArr[1];
        let newFa = newArr[2];
        // use the path position data to add the moved focus area newFa into the relevena position and remove from old position
        props.paths[studentPathPosition].projects[newProject].fa.splice(newFa, 0,  props.paths[studentPathPosition].projects[oldProject].fa.splice(oldFa, 1)[0]);
        props.dispatch(actions.updatePathList(props.paths, false, false )); 
        helpers.parseFa(props.paths[studentPathPosition]);    
    },
    removeFA(studentPathPosition,projPosition, idCounter, studentKey, faKey, props){
       // do quick check to make sure the correct fa is being removed
       if ((props.paths[studentPathPosition].student._key === studentKey) && (faKey === props.paths[studentPathPosition].projects[projPosition].fa[idCounter]._key)){
            // remove 1 FA at array position idCounter
            props.paths[studentPathPosition].projects[projPosition].fa.splice(idCounter, 1);
            // do some processing to get nextFA and nextStd
            helpers.parseFa(props.paths[studentPathPosition]);    
            props.dispatch(actions.updatePathList( props.paths, false, false ));  
       }
   
    },
    addFA(studentPathPosition, projPosition, idCounter, studentKey, faKey, addFAKey, props){
       // do quick check to make sure the correct fa is being removed
       let addAfterKey = 0;
       if ((faKey) && (props.paths[studentPathPosition].projects[projPosition].fa.length > 0)){
            addAfterKey = props.paths[studentPathPosition].projects[projPosition].fa[idCounter]._key;
       } 
       if ((props.paths[studentPathPosition].student._key === studentKey) && (faKey === addAfterKey)){
            // remove 1 FA at array position idCounter
            // for now it jst adds a copy
            // get fa details from databsae
        return axios.get('/api/fa/'+addFAKey).then(function(response) {
            // console.log(props.paths)
            // console.log("response fa", response.data.fa[0])
            if (response.data.success){
                // response.data == fa details
                props.paths[studentPathPosition].projects[projPosition].fa.splice(idCounter+1, 0, response.data.fa[0]);
                // do some processing to get nextFA and nextStd
                helpers.parseFa(props.paths[studentPathPosition]);
                props.dispatch(actions.updatePathList( props.paths, false, false )); 
                // reset selected FA
                helpers.saveSelectedFA("", props.dispatch);
            } else {
                // send error message
            }   
            return;
        }).catch((error) => {
            // send message to client...needs work
            console.log(error)
        })  
           
       }
   
    },
    getUserFA(username, dispatch){
        return axios.get('/fa/'+username).then(function(response) {
            if (response.data.success){
                dispatch(actions.focusAreas(response.data.fa))
                // props.dispatch(actions.updatePathList( props.paths, false, false )); 
            } else {
                // send error message
            }   
            return;
        }).catch((error) => {
            // send message to client...needs work
            console.log(error)
        })  


    },
    // parseFa(result){
    //     // console.log("result.fa.length", result.fa.length)
    //     for (var i = 0; i < result.fa.length; i++){
    //         // console.log("result.fa.length-1", result.fa.length-1)
    //         if ( i < result.fa.length-1) {
    //             result.fa[i].nextFA = result.fa[i+1]['Focus Area']
    //         } else {
    //             result.fa[i].nextFA = [];  // if 
    //         }
    //         // console.log(" result.fa[i].nextFA ",  result.fa[i].nextFA )
    //         result.fa[i]['currentStd'] = [];
    //         result.fa[i]['nextStd']= [];
    //         if (i < result.fa.length-1){  
    //             for (var j = 0; j <  result.fa[i+1].standardConnections.length; j++){
    //                 // save the first one
    //                 if ((j === 0)){
    //                     result.fa[i].nextStd.push(result.fa[i+1].standardConnections[j]);
    //                 }
    //                 // don't save duplicates
    //                 else if ((j > 0 ) && (result.fa[i+1].standardConnections[j-1] !== result.fa[i+1].standardConnections[j] )){
    //                     result.fa[i].nextStd.push(result.fa[i+1].standardConnections[j]);
    //                 }  
    //             }
    //         }  else {
    //             result.fa[i].nextStd = [];  // if 
    //         }

    //         // de-dup current fa std connections
    //         for (var k = 0; k < result.fa[i].standardConnections.length; k++){
    //             if ((k === 0)){
    //                 result.fa[i]['currentStd'].push(result.fa[i].standardConnections[k]);
    //             }
    //             else if ((k > 0 ) && (result.fa[i].standardConnections[k-1] !== result.fa[i].standardConnections[k] )){
    //             result.fa[i]['currentStd'].push(result.fa[i].standardConnections[k]);
    //             }                 
    //         }
    //     }
    // },
    parseFa(result){
        // parse for current student
        // for each project
        for (var l = 0; l < result.projects.length; l++){
            //for each focus area
            for (var i = 0; i < result.projects[l].fa.length; i++){
                // if there are more focus areas then get the next
                if ( i < result.projects[l].fa.length-1) {
                    result.projects[l].fa[i].nextFA = result.projects[l].fa[i+1]['Focus Area']
                } else {
                    // if there are no more focus areas for the current project
                    // if there is another project  for this student path - point to the first fa of the next project
                    if ((result.projects.length-1 > l ) && (result.projects[l+1].fa.length > 0)){
                        // moves to next project and the first fa in that project if one exists
                        result.projects[l].fa[i].nextFA = result.projects[l+1].fa[0]['Focus Area'];
                    } else {
                        result.projects[l].fa[i].nextFA = [];  
                    }
                }
                result.projects[l].fa[i]['currentStd'] = [];
                result.projects[l].fa[i]['nextStd']= [];
                // next standards
                if (i < result.projects[l].fa.length-1){  
                    for (var j = 0; j < result.projects[l].fa[i+1].standardConnections.length; j++){
                        // save the first one
                        if ((j === 0)){
                            result.projects[l].fa[i].nextStd.push(result.projects[l].fa[i+1].standardConnections[j]);
                        }
                        // don't save duplicates
                        else if ((j > 0 ) && (result.projects[l].fa[i+1].standardConnections[j-1] !== result.projects[l].fa[i+1].standardConnections[j] )){
                            result.projects[l].fa[i].nextStd.push(result.projects[l].fa[i+1].standardConnections[j]);
                        }  
                    }
                }  else {
                    // if there are no more focus areas for the current project
                    // if there is another project  for this student path - point to the standards of first fa of the next project
                    if ((result.projects.length-1 > l) && (result.projects[l+1].fa.length > 0)){
                        // moves to next project and the first fa in that project if one exists
                        for (var j = 0; j <  result.projects[l+1].fa[0].standardConnections.length; j++){
                             if ((j === 0)){
                                    result.projects[l].fa[i].nextStd.push(result.projects[l+1].fa[0].standardConnections[j]);
                                }
                                // don't save duplicates
                                else if ((j > 0 ) && (result.projects[l+1].fa[0].standardConnections[j-1] !== result.projects[l+1].fa[0].standardConnections[j] )){
                                    result.projects[l].fa[i].nextStd.push(result.projects[l+1].fa[0].standardConnections[j]);
                                }
                        }
                    } else {
                        result.projects[l].fa[i].nextStd = [];  // if 
                    }
                }

                // de-dup current fa std connections
                for (var k = 0; k < result.projects[l].fa[i].standardConnections.length; k++){
                    if ((k === 0)){
                        result.projects[l].fa[i]['currentStd'].push(result.projects[l].fa[i].standardConnections[k]);
                    }
                    else if ((k > 0 ) && (result.projects[l].fa[i].standardConnections[k-1] !== result.projects[l].fa[i].standardConnections[k] )){
                    result.projects[l].fa[i]['currentStd'].push(result.projects[l].fa[i].standardConnections[k]);
                    }                 
                }
            }
        }
    },
    removeChip(id, queryitem, dispatch){
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
    updateSelected(e, queryitem, dispatch){
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
    showView(action, dispatch){
        dispatch(actions.setPage(action));
    },
    getRoles(dispatch) {
        // return ['admin', 'teacher', 'user', 'internal']
        return axios.get('/api/roles/all').then(function(response) {
            // send results to redux store for use by SignUp component
            dispatch(actions.getRoles(response.data));
            return;
         }).catch((error) => {
            // send message to client...needs work
            console.log(error)
        })   
    },
    addInitialRows(displayFA, dispatch){
        dispatch(actions.showInitialRows(displayFA));
    },
    addRows(index, newvalue, dispatch){
        dispatch(actions.showMoreRows(index, newvalue ));
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
         }).catch((error) => {
            // send message to client...needs work
            console.log(error)
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
         }).catch((error) => {
            // send message to client...needs work
            console.log(error)
        })  
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
            if (response.data.success) {
                route.push('/');
            } else {
               dispatch(actions.userLoginError(!response.data.success, response.data.msg));
            }
            return;
         }).catch((error) => {
            // send message to client...needs work
            console.log(error)
        })  
        
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